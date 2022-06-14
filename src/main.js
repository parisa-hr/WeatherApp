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
  
      //stworzenie konteneru na canve
      container = document.getElementById("clouds");
  
      //stworzenie canvy
      var canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = window.innerHeight;
  
      /* 
          Początkowo płótno jest puste, pozbawione tła. 
          Aby coś na nim wyświetlić, skrypt musi posiadać dostęp do 
          kontekstu renderowania a następnie musi coś w nim narysować. 
      */
      var context = canvas.getContext("2d");
  
      // Stworzenie gradientu liniowego
      var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  
      // Wypelnij kontekst renderowania gradientem
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      // Stylizacja tła
      // container.style.backgroundColor = "0x4584b4";
      // container.style.backgroundSize = "32px 100%";
  
    // Umiejscowienie kamery
    
    /**
     * PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
          fov — Camera frustum vertical field of view.
          aspect — Camera frustum aspect ratio.
          near — Camera frustum near plane.
          far — Camera frustum far plane.
     */
      camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );
      camera.position.z = 6000;
  
      // Stworzenie sceny
      scene = new THREE.Scene();
  
      // Stworzenie geometrii
      geometry = new THREE.Geometry();
  
      // Załadowanie tekstury (chmurka)
      var texture = THREE.ImageUtils.loadTexture(
        "https://i.ibb.co/L6hRx8h/cloud1.png",
        null,
        animate
      );
  
      //Tworzenie mgly
      var fog = new THREE.Fog(0x4584b4, -100, 3000);
  
      //tworzenie ShaderMaterial
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
  
      //stworzenie plaszczyzny, na ktorej bedzie rysowana chmura
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(65, 65));
  
      // stworz plaszczyzny z chmurkami, w randomowych miejscach i z randomowym obrotem
      for (var i = 0; i < 8000; i++) {
        plane.position.x = Math.random() * 1000 - 500;
        plane.position.y = -(Math.floor(Math.random() * (90 - 15)) - 15);
        plane.position.z = i;
        plane.rotation.z = Math.random() * Math.PI;
        plane.scale.x = plane.scale.y =
          Math.floor(Math.random() * (1.4 - 1.0)) + 1.0;
  
        THREE.GeometryUtils.merge(geometry, plane);
      }
  
    //stworz siatke
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
  
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -8000;
      scene.add(mesh);
  
      //renserer, ktory wyrenderuje scene
      renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);
  
      document.addEventListener("mousemove", onDocumentMouseMove, false);
      window.addEventListener("resize", onWindowResize, false);
    }
  
    // funkcja reagujaca na zmiany polozenia kursora myszy
    // zmienia wskazania miernikow oraz polozenie kamery
    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) * 0.25;
      mouseY = (event.clientY - windowHalfY) * 0.15
      mouseX= Math.round(mouseX * 100) / 100
      mouseY= Math.round(mouseY * 100) / 100
      
      //wyswietl wartosci na licznikach
      $('#measurement-mouseX-value').text(mouseX);
      $('#measurement-mouseY-value').text(mouseY);
    }
  
    //reakcja na zmiane rozmiaru okna
    function onWindowResize(event) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    // animacja
    function animate() {
      requestAnimationFrame(animate);
  
      position = ((Date.now() - start_time) * 0.03) % 8000;
  
      camera.position.x += (mouseX - camera.position.x) * 0.005;
      camera.position.y += (-mouseY - camera.position.y) * 0.005;
      camera.position.z = -position + 8000;
  
      renderer.render(scene, camera);
    }
  }