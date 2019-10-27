import * as THREE from 'three';

(function () {

  const letter = getParam('letter');
  const fontFilePath = 'shirakawa-kinbun_v1.03.json';

  let scene, camera, renderer, fontLoader;
  let boxGeometry, textGeometry, material, phongMaterial, meshForBox, meshForText;
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
    camera.position.z = 700;

    let grid_count = 10; // グリッドの分割数
    let grid_size = grid_count;
    let grid = new THREE.GridHelper(grid_size, grid_count);
    grid.material.color = new THREE.Color(0xaaaaaa);
    scene.add(grid);

    // 3. Geometry
    boxGeometry = new THREE.BoxGeometry( 300, 300, 300 );// (幅, 高さ, 奥行き)
    textGeometry = new THREE.TextGeometry( letter, {
      font: fontData,
      size: 250,
      height: 120,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 4,
      bevelSegments: 20
    });

    // 4. Materials
    material = new THREE.MeshBasicMaterial( {color: 0x999999, wireframe: true} );
    phongMaterial = new THREE.MeshPhongMaterial({color: 0x999999, specular: 0xffffff});

    // 5. Meshs
    meshForBox = new THREE.Mesh( boxGeometry, material );
    meshForBox.position.x = 0;
    meshForBox.position.y = 0;
    meshForBox.position.z = 0;
    meshForBox.rotation.y = 45;
    scene.add( meshForBox );

    meshForText = new THREE.Mesh( textGeometry, phongMaterial );
    //meshForText.position.x = -250;
    meshForText.position.y = -100;
    meshForText.position.x = -100;
    scene.add( meshForText );

    // 6. Lights
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.x = -100;
    scene.add(directionalLight);

    // 7. Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      800,//window.innerWidth,
      800//window.innerHeight
    );

    // 8. Append objects to DOM
    document.body.appendChild( renderer.domElement );

    // 9. Run the world
    run();
  }

  function run() {
    requestAnimationFrame( run );
    meshForText.rotation.y += 0.03;
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
