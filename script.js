let scene, camera, renderer, cube;
let isAnimating = false;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = createDiceMaterials();

    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    renderer.domElement.addEventListener('click', onDocumentMouseDown, false);

    // Initialize all dice faces
    for (let i = 1; i <= 6; i++) {
        drawDiceFace(i);
    }

    animate();
}

function createDiceMaterials() {
    const materials = [];
    for (let i = 0; i < 6; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const texture = new THREE.CanvasTexture(canvas);
        materials.push(new THREE.MeshPhongMaterial({ map: texture }));
    }
    return materials;
}

function drawDiceFace(faceNumber) {
    const material = cube.material[faceNumber - 1];
    const canvas = material.map.image;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 128, 128);

    context.fillStyle = '#000000';
    const dotSize = 10;

    const dotPositions = [
        [],
        [[64, 64]],
        [[32, 32], [96, 96]],
        [[32, 32], [64, 64], [96, 96]],
        [[32, 32], [32, 96], [96, 32], [96, 96]],
        [[32, 32], [32, 96], [64, 64], [96, 32], [96, 96]],
        [[32, 32], [32, 64], [32, 96], [96, 32], [96, 64], [96, 96]]
    ];

    dotPositions[faceNumber].forEach(([x, y]) => {
        drawDot(context, x, y, dotSize);
    });

    material.map.needsUpdate = true;
}

function drawDot(context, x, y, size) {
    context.beginPath();
    context.arc(x, y, size, 0, 2 * Math.PI);
    context.fill();
}

function animate() {
    requestAnimationFrame(animate);
    if (isAnimating) {
        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
    }
    renderer.render(scene, camera);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    if (!isAnimating) {
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
            const randomFace = Math.floor(Math.random() * 6) + 1;
            rotateCubeToFace(randomFace);
        }, 1000); // Animation dauert 1 Sekunde
    }
}

function rotateCubeToFace(faceNumber) {
    cube.rotation.set(0, 0, 0);
    switch(faceNumber) {
        case 1: break; // Vorderseite, keine Rotation nötig
        case 2: cube.rotateY(Math.PI); break; // Rückseite
        case 3: cube.rotateY(-Math.PI / 2); break; // Rechte Seite
        case 4: cube.rotateY(Math.PI / 2); break; // Linke Seite
        case 5: cube.rotateX(-Math.PI / 2); break; // Oberseite
        case 6: cube.rotateX(Math.PI / 2); break; // Unterseite
    }
}

window.onload = init;

