/*****************************************************************************
 * 遊戲進入點.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
// 建構子.
function GameMain() {
    // 建立場景.
    var scene = this.scene = new THREE.Scene();
    // 建立攝影機.
    var camera = this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 建立成像物件.
    var renderer = this.renderer = new THREE.WebGLRenderer({ alpha: true});

    // 建立FPS.
    var stats = this.stats = new Stats();
    var container = this.container = document.createElement('div');

    // 移動板子射線.
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector3();
    var attractor = this.attractor = new THREE.Vector3();

    // 遊戲時脈.
    var gameClock = this.gameClock = new THREE.Clock();
    var gameClockOldT = this.gameClockOld = 0;

    // 鏡頭Z軸縮放.
    var cameraZoom = this.cameraZoom = -690;

    // 10:遊戲模式.
    var gameMainMode = this.gameMainMode = 10;

    // 初始THREE.
    initTHREE(camera, renderer);
    // 初始FPS.
    initFPS(stats, container);

    // gameMainMode(10:遊戲模式).
    if (gameMainMode == 10) {
        // 建立Gameplay物件.
        var gamePlay = this.gamePlay = new GamePlay(scene);
        // 建立關卡.
        gamePlay.resetGame(1);
    }
        
    // 設定成像迴圈.
    render();

    // 點擊滑鼠.
    window.addEventListener('mouseup', onMouseUp, false);
    // 滑鼠移動. 
    window.addEventListener('mousemove', onMouseMove, false);
    // 觸碰移動.
    window.addEventListener('touchmove', onTouchMove, false);
    // 觸碰放開.
    window.addEventListener('touchend', onTouchEnd, false);
    

    //----------------------------------------------------------------------------
    // 初始THREE.
    //----------------------------------------------------------------------------
    function initTHREE(camera, renderer) {
        // 建立成像物件.
        //renderer.shadowMap.enabled = true;
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // 設定全域光源物件.
        //var ambient = new THREE.AmbientLight(0xe0e0e0);
        //scene.add(ambient);

        // 設定平行光源物件.
        //var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0, 100);
        //directionalLight.position.set(0, -100, 150);
        //directionalLight.castShadow = true;
        //scene.add(directionalLight);
        
        // 設定聚光燈物件.
        var spotLight = this.spotLight1 = new THREE.SpotLight(0xffffff, 1.0);
        spotLight.position.set(0, 0, cameraZoom);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // 設置相機的位置
        camera.position.set(0, 0, cameraZoom);
        // 設置相機聚焦的位置.        
        camera.lookAt(scene.position);

        camera.rotation.x = Math.PI;
        camera.rotation.y = 0;
        camera.rotation.z = 0;

    }

    //----------------------------------------------------------------------------
    // 初始FPS.
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
    // 點擊滑鼠. 
    //--------------------------------------------------------------------
    function onMouseUp(e) {
        //console.log("onMouseUp!!");
        // gameMainMode(10:遊戲模式).
        if (gameMainMode == 10) {
            // gamePlayMode(10:開球模式).            
            if (gamePlay.gamePlayMode == 10) {
                // 11:遊戲模式.
                gamePlay.gamePlayMode = 11;
            }
        }        
    }

    //--------------------------------------------------------------------
    // 觸碰移動. 
    //--------------------------------------------------------------------
    function onMouseMove(e) {        
        // gameMainMode(10:遊戲模式).
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
    // 觸碰放開. 
    //--------------------------------------------------------------------
    function onTouchEnd(e) {
        // gameMainMode(10:遊戲模式).
        if (gameMainMode == 10) {
            // gamePlayMode(10:開球模式).            
            if (gamePlay.gamePlayMode == 10) {
                // 11:遊戲模式.
                gamePlay.gamePlayMode = 11;
            }
        }
    }

    //--------------------------------------------------------------------
    // 觸碰移動. 
    //--------------------------------------------------------------------
    function onTouchMove(e) {
        // 停用捲動.
        e.preventDefault();
        // 取的觸碰點.
        var touch = e.touches[0];

        // gameMainMode(10:遊戲模式).
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
    // 成像迴圈. 
    //--------------------------------------------------------------------
    function render() {
        // 鎖 FPS 30.
        gameClockOldT += gameClock.getDelta();
        if (gameClockOldT < 0.033) {
            requestAnimationFrame(render);
            return;
        }
        gameClockOldT -= 0.033;
                
        // 開始計算FPS.
        stats.begin();

        // gameMainMode(10:遊戲模式).
        if(gameMainMode == 10)
        {
            // 遊戲模式.
            if (gamePlay.gamePlayMode == 11) {
                // 計數,每5秒讓球加快一點速度.
                gamePlay.counter = Math.floor(gameClock.getElapsedTime() % 5);
            }           
           // 移動版子.
            gamePlay.paddleMove(attractor.x * 1, gamePlay.paddle.position.y, gamePlay.paddle.position.z);
            this.spotLight1.position.x = gamePlay.ball.position.x;
            this.spotLight1.position.y = gamePlay.ball.position.y;
            // 碰撞.
            gamePlay.update();
        }

        // 成像場景.
        renderer.render(scene, camera);
        // 設定執行成像.
        requestAnimationFrame(render);

        // 結束計算FPS.
        stats.end();
    }

}

//----------------------------------------------------------------------------
// 顯示或關閉FPS.
//----------------------------------------------------------------------------
GameMain.prototype.FPS = function (visible) {
    if (visible) {
        this.container.appendChild(this.stats.dom);
        //this.container.removeChild(this.stats.dom);
    }
}

//----------------------------------------------------------------------------
// 程式進入點.
//----------------------------------------------------------------------------
window.onload = function () {
    // 建立物件.
    var gameMain = new GameMain();
    // 顯示FPS.
    gameMain.FPS(false);
};