$(document).ready(function() {
    console.log("START");
    initClouds();
  });
  
  function initClouds() {
    if (!window.Detector && !window.Detector.webgl) Detector.addGetWebGLMessage();
  
    var container;
    var camera, scene, renderer;
    var mesh, geometry, material;
  
    var mouseX = 0,
      mouseY = 0;
    var start_time = Date.now();
  
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
  
    init();
  
    function init() {
  
      container = document.getElementById("clouds");
  
      var canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = window.innerHeight;
  
      var context = canvas.getContext("2d");
  
      var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
 
      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );
      camera.position.z = 6000;
  
      scene = new THREE.Scene();
  
      geometry = new THREE.Geometry();
  
      var texture = THREE.ImageUtils.loadTexture(
        "../assets/images/cloud.png",
        null,
        animate
      );
  
      var fog = new THREE.Fog(0x4584b4, -100, 3000);
  
      material = new THREE.ShaderMaterial({
        uniforms: {
          map: { type: "t", value: texture },
          fogColor: { type: "c", value: fog.color },
          fogNear: { type: "f", value: fog.near },
          fogFar: { type: "f", value: fog.far }
        },
        vertexShader: document.getElementById("vs").textContent,
        fragmentShader: document.getElementById("fs").textContent,
        depthWrite: false,
        depthTest: false,
        transparent: true
      });
  
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(65, 65));
  
      for (var i = 0; i < 8000; i++) {
        plane.position.x = Math.random() * 1000 - 500;
        plane.position.y = -(Math.floor(Math.random() * (90 - 15)) - 15);
        plane.position.z = i;
        plane.rotation.z = Math.random() * Math.PI;
        plane.scale.x = plane.scale.y =
          Math.floor(Math.random() * (1.4 - 1.0)) + 1.0;
  
        THREE.GeometryUtils.merge(geometry, plane);
      }
  
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
  
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -8000;
      scene.add(mesh);
  
      renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
  
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      window.addEventListener("resize", onWindowResize, false);
    }
  
    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) * 0.25;
      mouseY = (event.clientY - windowHalfY) * 0.15
      mouseX= Math.round(mouseX * 100) / 100
      mouseY= Math.round(mouseY * 100) / 100
      
      $('#measurement-mouseX-value').text(mouseX);
      $('#measurement-mouseY-value').text(mouseY);
    }
  
    function onWindowResize(event) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    function animate() {
      requestAnimationFrame(animate);
  
      position = ((Date.now() - start_time) * 0.03) % 8000;
  
      camera.position.x += (mouseX - camera.position.x) * 0.005;
      camera.position.y += (-mouseY - camera.position.y) * 0.005;
      camera.position.z = -position + 8000;
  
      renderer.render(scene, camera);
    }
  }