/*****************************************************************************
 * �C���i�J�I.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
// �غc�l.
function GameMain() {
    // �إ߳���.
    var scene = this.scene = new THREE.Scene();
    // �إ���v��.
    var camera = this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // �إߦ�������.
    var renderer = this.renderer = new THREE.WebGLRenderer({ alpha: true});

    // �إ�FPS.
    var stats = this.stats = new Stats();
    var container = this.container = document.createElement('div');

    // ���ʪO�l�g�u.
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector3();
    var attractor = this.attractor = new THREE.Vector3();

    // �C���ɯ�.
    var gameClock = this.gameClock = new THREE.Clock();
    var gameClockOldT = this.gameClockOld = 0;

    // ���YZ�b�Y��.
    var cameraZoom = this.cameraZoom = -690;

    // 10:�C���Ҧ�.
    var gameMainMode = this.gameMainMode = 10;

    // ��lTHREE.
    initTHREE(camera, renderer);
    // ��lFPS.
    initFPS(stats, container);

    // gameMainMode(10:�C���Ҧ�).
    if (gameMainMode == 10) {
        // �إ�Gameplay����.
        var gamePlay = this.gamePlay = new GamePlay(scene);
        // �إ����d.
        gamePlay.resetGame(1);
    }
        
    // �]�w�����j��.
    render();

    // �I���ƹ�.
    window.addEventListener('mouseup', onMouseUp, false);
    // �ƹ�����. 
    window.addEventListener('mousemove', onMouseMove, false);
    // Ĳ�I����.
    window.addEventListener('touchmove', onTouchMove, false);
    // Ĳ�I��}.
    window.addEventListener('touchend', onTouchEnd, false);
    

    //----------------------------------------------------------------------------
    // ��lTHREE.
    //----------------------------------------------------------------------------
    function initTHREE(camera, renderer) {
        // �إߦ�������.
        //renderer.shadowMap.enabled = true;
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // �]�w�����������.
        //var ambient = new THREE.AmbientLight(0xe0e0e0);
        //scene.add(ambient);

        // �]�w�����������.
        //var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0, 100);
        //directionalLight.position.set(0, -100, 150);
        //directionalLight.castShadow = true;
        //scene.add(directionalLight);
        
        // �]�w�E���O����.
        var spotLight = this.spotLight1 = new THREE.SpotLight(0xffffff, 1.0);
        spotLight.position.set(0, 0, cameraZoom);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // �]�m�۾�����m
        camera.position.set(0, 0, cameraZoom);
        // �]�m�۾��E�J����m.        
        camera.lookAt(scene.position);

        camera.rotation.x = Math.PI;
        camera.rotation.y = 0;
        camera.rotation.z = 0;

    }

    //----------------------------------------------------------------------------
    // ��lFPS.
    //----------------------------------------------------------------------------
    function initFPS(stats, container) {
        document.body.appendChild(container);
        var info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        info.innerHTML = '';
        container.appendChild(info);
    }

    //--------------------------------------------------------------------
    // �I���ƹ�. 
    //--------------------------------------------------------------------
    function onMouseUp(e) {
        //console.log("onMouseUp!!");
        // gameMainMode(10:�C���Ҧ�).
        if (gameMainMode == 10) {
            // gamePlayMode(10:�}�y�Ҧ�).            
            if (gamePlay.gamePlayMode == 10) {
                // 11:�C���Ҧ�.
                gamePlay.gamePlayMode = 11;
            }
        }        
    }

    //--------------------------------------------------------------------
    // Ĳ�I����. 
    //--------------------------------------------------------------------
    function onMouseMove(e) {        
        // gameMainMode(10:�C���Ҧ�).
        if (gameMainMode == 10) {
            e.preventDefault();
            mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0);
            mouse.unproject(camera);
            raycaster.ray.set(camera.position, mouse.sub(camera.position).normalize());
            var intersects = raycaster.intersectObject(gamePlay.wallBase);
            if (intersects.length > 0) {
                attractor = intersects[0].point;
            }
        }
    }

    //--------------------------------------------------------------------
    // Ĳ�I��}. 
    //--------------------------------------------------------------------
    function onTouchEnd(e) {
        // gameMainMode(10:�C���Ҧ�).
        if (gameMainMode == 10) {
            // gamePlayMode(10:�}�y�Ҧ�).            
            if (gamePlay.gamePlayMode == 10) {
                // 11:�C���Ҧ�.
                gamePlay.gamePlayMode = 11;
            }
        }
    }

    //--------------------------------------------------------------------
    // Ĳ�I����. 
    //--------------------------------------------------------------------
    function onTouchMove(e) {
        // ���α���.
        e.preventDefault();
        // ����Ĳ�I�I.
        var touch = e.touches[0];

        // gameMainMode(10:�C���Ҧ�).
        if (gameMainMode == 10) {
            e.preventDefault();
            mouse.set((touch.clientX / window.innerWidth) * 2 - 1, -(touch.clientY / window.innerHeight) * 2 + 1, 0);
            mouse.unproject(camera);
            raycaster.ray.set(camera.position, mouse.sub(camera.position).normalize());
            var intersects = raycaster.intersectObject(gamePlay.wallBase);
            if (intersects.length > 0) {
                attractor = intersects[0].point;
            }
        }
    }

    //--------------------------------------------------------------------
    // �����j��. 
    //--------------------------------------------------------------------
    function render() {
        // �� FPS 30.
        gameClockOldT += gameClock.getDelta();
        if (gameClockOldT < 0.033) {
            requestAnimationFrame(render);
            return;
        }
        gameClockOldT -= 0.033;
                
        // �}�l�p��FPS.
        stats.begin();

        // gameMainMode(10:�C���Ҧ�).
        if(gameMainMode == 10)
        {
            // �C���Ҧ�.
            if (gamePlay.gamePlayMode == 11) {
                // �p��,�C5�����y�[�֤@�I�t��.
                gamePlay.counter = Math.floor(gameClock.getElapsedTime() % 5);
            }           
           // ���ʪ��l.
            gamePlay.paddleMove(attractor.x * 1, gamePlay.paddle.position.y, gamePlay.paddle.position.z);
            this.spotLight1.position.x = gamePlay.ball.position.x;
            this.spotLight1.position.y = gamePlay.ball.position.y;
            // �I��.
            gamePlay.update();
        }

        // ��������.
        renderer.render(scene, camera);
        // �]�w���榨��.
        requestAnimationFrame(render);

        // �����p��FPS.
        stats.end();
    }

}

//----------------------------------------------------------------------------
// ��ܩ�����FPS.
//----------------------------------------------------------------------------
GameMain.prototype.FPS = function (visible) {
    if (visible) {
        this.container.appendChild(this.stats.dom);
        //this.container.removeChild(this.stats.dom);
    }
}

//----------------------------------------------------------------------------
// �{���i�J�I.
//----------------------------------------------------------------------------
window.onload = function () {
    // �إߪ���.
    var gameMain = new GameMain();
    // ���FPS.
    gameMain.FPS(false);
};