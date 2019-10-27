import * as THREE from 'three';

(function () {

  const letter = getParam('letter');
  const fontFilePath = 'shirakawa-kinbun_v1.03.json';

  let scene, camera, renderer, fontLoader;
  let boxGeometry, textGeometry, material, phongMaterial, meshForBox, meshForText, floor;
  let directionalLight, ambientLight;

  function initialize() {
    fontLoader = new THREE.FontLoader();
    fontLoader.load( fontFilePath, initThreeObjects);
  }

  /* NOTE: [ hierarchy image ]
    renderer.domElement
      - Scene
        - Camera
        - Light
        - Mesh (Geometry, Material)
  */
  function initThreeObjects (fontData) {

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera( 50, 1, 1, 10000);// (視野角, アスペクト比, near, far)
    camera.position.z = 500;

    // Floor
    floor = new THREE.GridHelper(10000, 80);
    floor.material.color = new THREE.Color(0x222222);
    floor.position.set(0, -200, 0);
    floor.rotation.y = 5;
    scene.add(floor);

    // 3. Geometry
    boxGeometry = new THREE.BoxGeometry( 200, 200, 200 );// (幅, 高さ, 奥行き)
    textGeometry = new THREE.TextGeometry( letter, {
      font: fontData,
      size: 250,
      height: 20,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 4,
      bevelSize: 4,
      bevelSegments: 1
    });

    // 4. Materials
    material = new THREE.MeshBasicMaterial( {color: 0x999999, wireframe: true} );
    phongMaterial = new THREE.MeshPhongMaterial({color: 0x999999, specular: 0xffffff});

    // 5. Meshs
    meshForBox = new THREE.Mesh( boxGeometry, material );
    meshForBox.position.set(0,1,100);
    meshForBox.rotation.y = 45;
    meshForBox.castShadow = true;
    //scene.add( meshForBox );

    meshForText = new THREE.Mesh( textGeometry, phongMaterial );
    meshForText.position.x = -250;
    meshForText.position.y = -100;
    meshForText.position.x = -100;
    scene.add( meshForText );

    // 6. Lights
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set( -1000, 1000, 0);
    scene.add(directionalLight);

    // 7. Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      800,//window.innerWidth,
      800//window.innerHeight
    );
    renderer.shadowMap.enabled = true;

    // 8. Append objects to DOM
    document.getElementById('wrapper').appendChild( renderer.domElement );

    // 9. Run the world
    run();
  }

  function run() {
    requestAnimationFrame( run );
    meshForBox.rotation.y -= 0.003;
    meshForText.rotation.y += 0.002;
    renderer.render( scene, camera );
  }

  function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  initialize();
})();
