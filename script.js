let scene, camera, renderer, cube;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [];

    // Erstelle Texturen für die Würfelseiten
    for (let i = 1; i <= 6; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = '#000000';
        context.font = 'bold 64px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(i.toString(), 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        materials.push(new THREE.MeshBasicMaterial({ map: texture }));
    }

    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 3;

    document.addEventListener('click', onDocumentMouseDown, false);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    cube.rotation.x += Math.PI / 2;
    cube.rotation.y += Math.PI / 2;
}

window.onload = init;

