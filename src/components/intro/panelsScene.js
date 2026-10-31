// Scène Three.js de l'introduction : deux panneaux mats qui se rejoignent au
// centre de l'écran, puis s'écartent pour révéler le site.
//
// Principes :
// - Rendu "à la demande" : on dessine une image au chargement, puis seulement
//   pendant l'ouverture (1,5 s). Aucune boucle qui tourne en permanence.
// - Tout est libéré (géométries, matériaux, textures, contexte WebGL) dès que
//   l'intro est finie : la 3D ne coûte plus rien ensuite.
// - Les panneaux viennent de Blender si public/models/panels.glb existe
//   sinon ils sont générés ici.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const COLORS = { wine: 0x581c35, ivory: 0xfff9f0, pink: 0xf4c2d7, lemon: 0xe8ff54 };

const MODEL_URL = '/models/panels.glb';
const FOV = 32;
const CAMERA_Z = 12;
const THICKNESS = 0.4;
const OPEN_MS = 1500;
const UNTIE_MS = 1500;
const OVERLAP = 0.35; // les panneaux débordent de l'écran : aucun bord visible

const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeInCubic = (x) => x * x * x;
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);

// Grain fin généré à la volée (pas de fichier à charger) : donne au bordeaux
// un aspect de pierre ou de papier épais, sans le rendre brillant.
function makeGrainTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 110 + Math.floor(Math.random() * 70);
    image.data[i] = v;
    image.data[i + 1] = v;
    image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Panneaux modélisés dans Blender. Contrat attendu (voir le script Blender) :
// deux objets nommés PanelLeft et PanelRight, transformations appliquées,
// PanelLeft occupant x de -1 à 0 et PanelRight x de 0 à 1, y de -1 à 1.
async function loadBlenderPanels() {
  try {
    const head = await fetch(MODEL_URL, { method: 'HEAD' });
    const type = head.headers.get('content-type') || '';
    // Le serveur de dev renvoie index.html (200) quand un fichier n'existe pas.
    if (!head.ok || type.includes('text/html')) return null;

    const gltf = await new GLTFLoader().loadAsync(MODEL_URL);
    const left = gltf.scene.getObjectByName('PanelLeft');
    const right = gltf.scene.getObjectByName('PanelRight');
    if (!left?.geometry || !right?.geometry) return null;
    return { left, right };
  } catch {
    return null;
  }
}

function buildSlabGeometry(width, height) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 2,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -THICKNESS / 2);
  return geometry;
}

function extrudeShape(shape, depth, bevel) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 18,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

// Une aile du nœud, vers la droite. Le centre du nœud est en (0, 0).
function wingShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0.1, 0.14);
  shape.bezierCurveTo(0.5, 0.7, 1.15, 0.78, 1.3, 0.6);
  shape.lineTo(1.3, -0.6);
  shape.bezierCurveTo(1.15, -0.78, 0.5, -0.7, 0.1, -0.14);
  shape.closePath();
  return shape;
}

// Un pan qui pend sous le nœud, avec une encoche en V.
function tailShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.13, 0);
  shape.lineTo(0.13, 0);
  shape.lineTo(0.3, -1.05);
  shape.lineTo(0, -0.86);
  shape.lineTo(-0.3, -1.05);
  shape.closePath();
  return shape;
}

// Nœud papillon en Three.js : deux ailes roses, un nœud citron, deux pans.
// Largeur totale : environ 2,6 unités (mise à l'échelle dans layout()).
function createBowTie() {
  const group = new THREE.Group();
  const geometries = [];
  const wingMaterial = new THREE.MeshStandardMaterial({ color: COLORS.pink, roughness: 0.85, metalness: 0 });
  const tailMaterial = new THREE.MeshStandardMaterial({ color: COLORS.pink, roughness: 0.9, metalness: 0 });
  const knotMaterial = new THREE.MeshStandardMaterial({ color: COLORS.lemon, roughness: 0.7, metalness: 0 });
  const materials = [wingMaterial, tailMaterial, knotMaterial];

  const wingGeometry = extrudeShape(wingShape(), 0.2, 0.05);
  const tailGeometry = extrudeShape(tailShape(), 0.07, 0.02);
  const knotGeometry = new THREE.CapsuleGeometry(0.17, 0.26, 8, 18);
  geometries.push(wingGeometry, tailGeometry, knotGeometry);

  // Chaque aile est dans un pivot : on anime le pivot, pas la forme.
  const rightWing = new THREE.Group();
  rightWing.add(new THREE.Mesh(wingGeometry, wingMaterial));

  const leftWing = new THREE.Group();
  const mirror = new THREE.Group();
  mirror.scale.x = -1;
  mirror.add(new THREE.Mesh(wingGeometry, wingMaterial));
  leftWing.add(mirror);

  const knot = new THREE.Mesh(knotGeometry, knotMaterial);
  knot.position.z = 0.04;

  const tailLeft = new THREE.Group();
  tailLeft.add(new THREE.Mesh(tailGeometry, tailMaterial));
  const tailRight = new THREE.Group();
  tailRight.add(new THREE.Mesh(tailGeometry, tailMaterial));
  const tailBase = { y: -0.1, z: -0.07, angle: 0.28 };
  tailLeft.position.set(-0.04, tailBase.y, tailBase.z);
  tailRight.position.set(0.04, tailBase.y, tailBase.z);
  tailLeft.rotation.z = tailBase.angle;
  tailRight.rotation.z = -tailBase.angle;

  group.add(tailLeft, tailRight, leftWing, rightWing, knot);

  // p va de 0 (noué) à 1 (défait). Le nœud se desserre d'abord, puis les
  // ailes se détachent et tombent, puis les pans, et tout s'efface.
  function applyUntie(p) {
    const pulse = Math.sin(clamp01(p / 0.3) * Math.PI * 4) * (1 - clamp01(p / 0.3)) * 0.08;
    const knotOut = easeInCubic(clamp01((p - 0.1) / 0.5));
    knot.scale.setScalar(Math.max(1 + pulse - knotOut, 0.001));
    knot.rotation.z = knotOut * 1.2;

    const wing = easeInCubic(clamp01((p - 0.18) / 0.82));
    const shake = Math.sin(clamp01(p / 0.25) * Math.PI * 2) * 0.06 * (1 - clamp01(p / 0.25));
    rightWing.position.set(wing * 1.8, -wing * 3.2, 0);
    rightWing.rotation.z = -wing * 1.1 - shake;
    leftWing.position.set(-wing * 1.8, -wing * 3.2, 0);
    leftWing.rotation.z = wing * 1.1 + shake;

    const tail = easeInCubic(clamp01((p - 0.28) / 0.72));
    tailLeft.position.y = tailBase.y - tail * 4;
    tailRight.position.y = tailBase.y - tail * 4;
    tailLeft.rotation.z = tailBase.angle + tail * 0.5;
    tailRight.rotation.z = -tailBase.angle - tail * 0.5;

    const opacity = 1 - clamp01((p - 0.72) / 0.28);
    materials.forEach((material) => {
      material.transparent = p > 0;
      material.opacity = opacity;
    });
    group.visible = p < 1;
  }

  return {
    group,
    applyUntie,
    dispose() {
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
}

export async function createPanelsScene(host) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, CAMERA_Z);

  // Éclairage de studio : une lumière principale ivoire, un reflet rose
  // très doux par en dessous, et un ciel/sol qui évitent les noirs bouchés.
  scene.add(new THREE.HemisphereLight(COLORS.ivory, COLORS.wine, 1.1));
  const key = new THREE.DirectionalLight(COLORS.ivory, 2.4);
  key.position.set(3, 4, 8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(COLORS.pink, 0.9);
  fill.position.set(-6, -3, 5);
  scene.add(fill);

  const grain = makeGrainTexture();
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.wine,
    roughness: 0.92,
    metalness: 0,
    bumpMap: grain,
    bumpScale: 0.5,
  });

  const blender = await loadBlenderPanels();
  console.info(
    blender
      ? '[intro] Panneaux chargés depuis Blender (public/models/panels.glb).'
      : '[intro] Panneaux générés par le code (aucun public/models/panels.glb valide trouvé).'
  );

  const materials = [baseMaterial];
  let leftMesh;
  let rightMesh;

  if (blender) {
    const prepare = (node) => {
      let material = baseMaterial;
      if (node.material) {
        material = node.material.clone();
        material.side = THREE.FrontSide;
        if (!material.bumpMap) {
          grain.repeat.set(8, 12);
          material.bumpMap = grain;
          material.bumpScale = 0.5;
        }
        materials.push(material);
      }
      return new THREE.Mesh(node.geometry.clone(), material);
    };
    leftMesh = prepare(blender.left);
    rightMesh = prepare(blender.right);
  } else {
    leftMesh = new THREE.Mesh(new THREE.BufferGeometry(), baseMaterial);
    rightMesh = new THREE.Mesh(new THREE.BufferGeometry(), baseMaterial);
  }
  scene.add(leftMesh, rightMesh);

  const bow = createBowTie();
  scene.add(bow.group);

  let disposed = false;
  let raf = 0;
  let progress = 0;
  let panelWidth = 1;
  let ready = false;

  function applyProgress(p) {
    const e = easeInOutCubic(p);
    const travel = panelWidth + 0.8;
    // Léger recul de la caméra pendant l'ouverture (une seule fois, 1,5 s).
    camera.position.z = CAMERA_Z - e * 1.6;

    if (blender) {
      leftMesh.position.x = -e * travel;
      rightMesh.position.x = e * travel;
    } else {
      leftMesh.position.x = -panelWidth / 2 + 0.01 - e * travel;
      rightMesh.position.x = panelWidth / 2 - 0.01 + e * travel;
    }
  }

  function render() {
    if (!disposed) renderer.render(scene, camera);
  }

  function layout() {
    const width = host.clientWidth || window.innerWidth;
    const height = host.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
    const visibleWidth = visibleHeight * camera.aspect;
    panelWidth = visibleWidth / 2 + OVERLAP;
    const panelHeight = visibleHeight * 1.1;

    if (blender) {
      leftMesh.scale.set(panelWidth, panelHeight / 2, 1);
      rightMesh.scale.set(panelWidth, panelHeight / 2, 1);
    } else {
      leftMesh.geometry.dispose();
      rightMesh.geometry.dispose();
      leftMesh.geometry = buildSlabGeometry(panelWidth, panelHeight);
      rightMesh.geometry = buildSlabGeometry(panelWidth, panelHeight);
    }

    // Le nœud occupe environ 40 % de la largeur, sans dépasser 70 % de la hauteur.
    const bowScale = Math.min(visibleWidth * 0.42, visibleHeight * 0.7) / 2.6;
    bow.group.scale.setScalar(bowScale);
    bow.group.position.set(0, visibleHeight * 0.04, THICKNESS / 2 + 0.25);

    applyProgress(progress);
  }

  layout();
  render();
  ready = true;

  const resizeObserver = new ResizeObserver(() => {
    if (disposed) return;
    layout();
    render();
  });
  resizeObserver.observe(host);

  return {
    get ready() {
      return ready;
    },

    // Défait le nœud papillon. Résout la promesse à la fin.
    untie() {
      return new Promise((resolve) => {
        if (disposed) {
          resolve();
          return;
        }
        const start = performance.now();
        const tick = (now) => {
          if (disposed) {
            resolve();
            return;
          }
          const p = Math.min((now - start) / UNTIE_MS, 1);
          bow.applyUntie(p);
          render();
          if (p < 1) raf = requestAnimationFrame(tick);
          else resolve();
        };
        raf = requestAnimationFrame(tick);
      });
    },

    // Fait glisser les deux panneaux. Résout la promesse à la fin.
    open() {
      return new Promise((resolve) => {
        if (disposed) {
          resolve();
          return;
        }
        const start = performance.now();
        const tick = (now) => {
          if (disposed) {
            resolve();
            return;
          }
          progress = Math.min((now - start) / OPEN_MS, 1);
          applyProgress(progress);
          render();
          if (progress < 1) raf = requestAnimationFrame(tick);
          else resolve();
        };
        raf = requestAnimationFrame(tick);
      });
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      leftMesh.geometry.dispose();
      rightMesh.geometry.dispose();
      materials.forEach((material) => material.dispose());
      bow.dispose();
      grain.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
