import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import gsap from 'gsap';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/loaders/GLTFLoader.js';

/* 
    Actividad
    - Cambiar imagenes por modelos(puede ser el mismo modelo)
    - Limitar el scroll
 */

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
   //scroll
   

   var last_known_scroll_position = 0;
   var ticking = false;

   function doSomething(scroll_pos) {

  }
  
  window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        doSomething(last_known_scroll_position);
        ticking = false;
      });
    }
    ticking = true;
  });

    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    let car;
    let hlight;
    let loader = new GLTFLoader();
    let y = 0;
    let position = 0;
    let directionalLight;
   let light;
   let light2;
   let light3;
   let light4;
    
    let objs = [];
    
    document.body.onload = () => {
      main();
    };
    
    window.onresize = () => {
      scene.background = new THREE.Color(0xdddddd);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, true);
    };
    
    window.addEventListener('wheel', onMouseWheel);
    
    function main() {
      // Configurracion inicial
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      scene.background = new THREE.Color(0xdddddd);
      document.body.appendChild(renderer.domElement);
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 0;
      scene.add(camera);
    
      cameraConfig();


      // Lights
      setupLights();
    
      // Imagenes
      loadImages();
    
      animate();

    }
    
    
    function loadImages() {
      // Loader de Textura

    
      for (let i = 0; i < 4; i++) {
        loader.load(
          `/assets/${i}.gltf`,
          function (gltf) {
            car = gltf.scene.children[0];
            scene.add(gltf.scene);
            scene.traverse((object) => {
              if (object.isMesh) objs.push(object);
            });
            animate();
            car.position.set(0, i* -300);
          },
        );
        
        
      }
    
     
    }
    
    function animate() {
      requestAnimationFrame(animate);
      updateElements();
      renderer.render(scene, camera);
      console.log(camera.position);
      console.log(camera.rotation);
    }
    
    function cameraConfig() {
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 800;
    }

    function setupLights() {
      const pointLight = new THREE.PointLight(0xffffff, 0.1);
      pointLight.position.x = 2;
      pointLight.position.y = 3;
      pointLight.position.z = 4;
      scene.add(pointLight);

      hlight = new THREE.AmbientLight(0x404040, );
      scene.add(hlight);
    
      directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
      directionalLight.position.set(0, 1, 0);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
    
      light = new THREE.PointLight(0xc4c4c4, 0);
      light.position.set(0, 300, 500);
      scene.add(light);
    
      light2 = new THREE.PointLight(0xc4c4c4, 1);
      light2.position.set(500, 100, 0);
      scene.add(light2);
    
      light3 = new THREE.PointLight(0xc4c4c4, 1);
      light3.position.set(0, 100, -500);
      scene.add(light3);
    
      light4 = new THREE.PointLight(0xc4c4c4, 1);
      light4.position.set(-500, 300, 500);
      scene.add(light4);
    }
    
    function onMouseWheel(event) {
     y = -event.deltaY * 0.07;
    }
    

    function updateElements() {
      position += y;
      y *= 0.9;
    
      // Raycaster
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objs);
    
      for (const intersect of intersects) {
        gsap.to(intersect.object.scale, { x: 1, y: 1 });
        gsap.to(intersect.object.rotation, { x: 0 });
        gsap.to(intersect.object.rotation, { z: 0.8 });
        gsap.to(intersect.object.position, { z: -0.01 });
      }
    
      for (const object of objs) {
        if (!intersects.find((intersect) => intersect.object === object)) {
          gsap.to(object.scale, { x: 1, y: 1 });
          gsap.to(object.rotation, { z: 0 });
          gsap.to(object.position, { x: 0 });
        }
      }

      if(position>50){
        position=50;
      }else if(position<-800){
        position=-800;
      }

      camera.position.y = position;
    }
    