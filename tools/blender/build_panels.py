"""
Panneaux de l'introduction : modélisation et export en GLB.

Contrat avec le site (src/components/intro/panelsScene.js) :
  - deux objets nommés exactement PanelLeft et PanelRight ;
  - transformations appliquées : l'origine de chaque objet est à l'origine du monde ;
  - PanelLeft occupe x de -1 à 0, PanelRight x de 0 à 1 (la jointure est au centre) ;
  - la hauteur va de -1 à 1 : c'est l'axe Z dans Blender, que l'exporteur
    convertit en axe Y (glTF) ;
  - l'épaisseur est libre : le site étire les panneaux en largeur et en hauteur,
    pas en profondeur.
"""

import os

import bpy

# Lancé depuis l'onglet Scripting, Blender ne définit pas __file__ : dans ce cas,
# renseigner OUT_OVERRIDE avec le chemin complet de public/models/panels.glb.
OUT_OVERRIDE = None

if OUT_OVERRIDE:
    OUT = OUT_OVERRIDE
else:
    try:
        OUT = os.path.normpath(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "public", "models", "panels.glb")
        )
    except NameError:
        raise SystemExit("Renseigner OUT_OVERRIDE avec le chemin complet de panels.glb.")

WINE_SRGB = (0x58, 0x1C, 0x35)  # #581C35
THICKNESS = 0.4
BEVEL = 0.05


def srgb_to_linear(channel_255):
    # Blender attend des couleurs linéaires ; on part du code hexadécimal sRGB.
    c = channel_255 / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_material():
    material = bpy.data.materials.new("WineMatte")
    material.use_nodes = True
    bsdf = material.node_tree.nodes["Principled BSDF"]
    r, g, b = (srgb_to_linear(c) for c in WINE_SRGB)
    bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.92
    bsdf.inputs["Metallic"].default_value = 0.0
    return material


def make_panel(name, side, material):
    """side = -1 pour le panneau gauche, +1 pour le droit."""
    bpy.ops.mesh.primitive_cube_add(size=2)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name

    # Le cube fait 2 x 2 x 2 : on le ramène à 1 (largeur) x THICKNESS x 2 (hauteur),
    # puis on applique position et échelle pour que l'origine soit au centre du monde.
    obj.scale = (0.5, THICKNESS / 2, 1.0)
    obj.location = (side * 0.5, 0.0, 0.0)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    bevel = obj.modifiers.new("Bevel", "BEVEL")
    bevel.width = BEVEL
    bevel.segments = 3
    bpy.ops.object.modifier_apply(modifier=bevel.name)

    obj.data.materials.append(material)
    return obj


def main():
    clear_scene()
    material = make_material()
    make_panel("PanelLeft", -1, material)
    make_panel("PanelRight", +1, material)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", export_yup=True, export_apply=True)
    print("Panneaux exportés :", OUT)


main()
