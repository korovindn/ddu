import "./style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const init = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();

  const canvas = document.getElementById("bg");

  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.setZ(10);
  camera.position.setX(-1);

  const ambl = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambl);

  const ptl1 = new THREE.PointLight(0xffffff, 300);
  ptl1.position.set(10, 4, 5);
  scene.add(ptl1);

  const ptl2 = new THREE.PointLight(0xffffff, 300);
  ptl2.position.set(-10, 4, 5);
  scene.add(ptl2);

  const gltfLoader = new GLTFLoader();

  const cubeLoader = new THREE.CubeTextureLoader();
  const env = cubeLoader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
  ]);

  const material = new THREE.MeshPhongMaterial({
    envMap: env,
    reflectivity: 0.1,
    shininess: 1,
    color: 0xffffff,
  });

  gltfLoader.load("/untitled.glb", (gltf) => {
    gltf.scene.traverse((o) => {
      if ("material" in o) o.material = material;
    });
    gltf.scene.position.y = -12;
    gltf.scene.rotation.y = -1;
    scene.add(gltf.scene);
    window.onscroll = () => {
      gltf.scene.rotation.y = -1 + window.pageYOffset / 1500;
    };
  });

  window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();

  let oldX = 0;
  let oldY = 0;

  window.onmousemove = (e) => {
    const dx = e.x - oldX;
    const dy = e.y - oldY;
    camera.position.x += dx / 5000;
    camera.position.y += dy / 5000;
    oldX = e.x;
    oldY = e.y;
  };

  renderer.render(scene, camera);
};

init();
