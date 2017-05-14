/*****************************************************************************
 * 遊戲GamePlay.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
// 建構子.
function GamePlay(scene, x, y) {
    // 紀錄場景指標.
    this.scene = scene;

    // 設定-板子長度.
    this.paddleLen = 120;

    // 磚塊初始位置.
    this.mx = -415;
    this.my = -400;

    // 球位置.
    this.x = 0;
    this.y = 0;

    // 10:開球模式.
    // 11:遊戲模式.
    this.gamePlayMode = 10;

    // 關卡.
    this.levelID = 1;

    // 管卡管理器.
    this.levelManager = new LevelManager();

    //------------------------------------------------------------------------
    // 底牆.
    var wallGeometry = new THREE.BoxGeometry( 913, 1080, 250);
    var wallMaterial = new THREE.MeshLambertMaterial({ "color": "#009912" });
    this.wallBase = new THREE.Mesh(wallGeometry, wallMaterial);
    this.wallBase.name = "wallBase";
    this.wallBase.position.set( 0, 0, 150);
    this.wallBaseMove = function (x, y, z) {
        this.wallBase.position.set(x, y, z);
    }
    this.wallBase.castShadow = true;
    this.wallBase.receiveShadow = true;
    scene.add(this.wallBase);

    //------------------------------------------------------------------------
    // 版子.
    this.paddleGeometry = new THREE.BoxGeometry( this.paddleLen, 26, 32);
    this.paddleMaterial = new THREE.MeshLambertMaterial({ "color": "#fff" });
    this.paddle = new THREE.Mesh(this.paddleGeometry, this.paddleMaterial);
    this.paddle.name = "paddle";
    this.paddle.geometry.computeBoundingBox();
    this.paddleBBox = new THREE.Box3(this.paddle.geometry.boundingBox.min, this.paddle.geometry.boundingBox.max);
    this.paddleBBox.name = "paddleBBox";
    this.paddleBBox.id = 2000;
    this.paddleX = 0;
    this.paddleY = 420;
    this.paddle.position.set(this.paddleX, this.paddleY, 0);
    this.paddleMove = function (x, y, z) {
        if (x > 396) { x = 396; }
        if (x < -396) { x = -396; }
        this.paddle.position.set(x, y, z);
        this.paddleBBox.setFromObject(this.paddle);
    }
    this.paddle.castShadow = true;
    scene.add(this.paddle);

    //------------------------------------------------------------------------
    // 球.
    this.ballGeometry = new THREE.SphereGeometry(12);
    //this.ballMaterial = new THREE.MeshNormalMaterial();
    this.ballMaterial = new THREE.MeshLambertMaterial({ "color": "#fff" });
    this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
    this.ball.name = "ball";
    this.ball.geometry.computeBoundingBox();
    this.ballBBox = new THREE.Box3(this.ball.geometry.boundingBox.min, this.ball.geometry.boundingBox.max);
    this.ballBBox.name = "ballBBox";
    this.ballBBox.id = 1000;
    // (-444~444)
    this.ballX = this.x = this.paddleX;
    // (-528~528)
    this.ballY = this.y = this.paddleY-20;
    this.ball.position.set(this.ballX, this.ballY, 0);
    this.ballMove = function (x, y, z) {
        this.ball.position.set(x, y, z);
        this.ballBBox.setFromObject(this.ball);
    }
    this.ball.castShadow = true;
    scene.add(this.ball);
}

//----------------------------------------------------------------------------
// 初始遊戲.
//----------------------------------------------------------------------------
GamePlay.prototype.resetGame = function (id) {

    // 磚塊數量.
    this.bricksMax = 0;
    this.aabbList = [];
    this.aabbName = "";

    // 設定開球模式.
    this.gamePlayMode = 10;

    // 初始速度.
    this.speedDx = 12;
    this.speedDy = 12;
    this.counter == 0

    // 球移動速度.
    this.dx =  this.speedDx;
    this.dy = -this.speedDy;

    // 磚塊陣列(11x15).
    var level = this.levelManager.getLevel(id);
    var pos = 0;
    this.bricksArray = [];
    for (ix = 0; ix < 11; ix++) {
        this.bricksArray[ix] = [];
        for (iy = 0; iy < 15; iy++) {
            pos = (iy * 11) + ix;
            if (level[pos] != 0) {
                this.bricksArray[ix][iy] = new Bricks();
                this.scene.add(this.bricksArray[ix][iy].init("bricks_" + ix + "_" + iy, "bricksCollide_" + ix + "_" + iy, level[pos]));
                this.bricksArray[ix][iy].bricksMove(this.mx + ((80 + 3) * ix), this.my + ((26 + 3) * iy), 0);
                this.aabbList.push(this.bricksArray[ix][iy].bricksBBox);
                this.bricksMax++;
            } else {
                this.bricksArray[ix][iy] = null;
            }
        }
    }
}

//----------------------------------------------------------------------------
// 處理球反彈.
//----------------------------------------------------------------------------
GamePlay.prototype.ballBounce = function (dis) {
    // 依打中位置算出球角度偏移.
    var dis1 = Math.abs(dis);
    if (dis1 > (this.paddleLen >> 1)) { dis1 = (this.paddleLen >> 1); }
    var dis2 = (3 - (dis1 / 10)) * 1.8;    

    // 1.右下.
    if (this.dx > 0 && this.dy >= 0) {
        // 算出移動偏移.
        if (dis2 < 0) {
            this.dx = this.speedDx + Math.abs(dis2);
            this.dy = this.speedDy - Math.abs(dis2);
        } else {
            this.dx = this.speedDx - Math.abs(dis2);
            this.dy = this.speedDy + Math.abs(dis2);
        }

        // 反彈.
        if (dis < 0) {
            this.dy = -this.dy;
        // 原路徑返回.
        } else {
            this.dx = -this.dx;
            this.dy = -this.dy;
        }

    // 2.左下.
    } else if (this.dx < 0 && this.dy >= 0) {
        // 算出移動偏移.
        if (dis2 < 0) {
            this.dx = -(this.speedDx + Math.abs(dis2));
            this.dy = (this.speedDy - Math.abs(dis2));
        } else {
            this.dx = -(this.speedDx - Math.abs(dis2));
            this.dy = (this.speedDy + Math.abs(dis2));
        }

        // 原路徑返回.
        if (dis < 0) {
            this.dx = -this.dx;
            this.dy = -this.dy;
        // 反彈.
        } else {
            this.dy = -this.dy;
        }

    // 3.左上.
    } else if (this.dx > 0 && this.dy <= 0) {
        // 算出移動偏移.
        if (dis2 < 0) {
            this.dx =   this.speedDx - Math.abs(dis2);
            this.dy = -(this.speedDy + Math.abs(dis2));
        } else {
            this.dx =   this.speedDx + Math.abs(dis2);
            this.dy = -(this.speedDy - Math.abs(dis2));
        }

        // 反彈.
        if (dis < 0) {
            this.dy = -this.dy;
        // 原路徑返回.
        } else {
            this.dx = -this.dx;
            this.dy = -this.dy;
        }

    // 4.右上.
    } else if (this.dx < 0 && this.dy <= 0) {
        // 算出移動偏移.
        if (dis2 < 0) {
            this.dx = -(this.speedDx - Math.abs(dis2));
            this.dy = -(this.speedDy + Math.abs(dis2));
        } else {
            this.dx = -(this.speedDx + Math.abs(dis2));
            this.dy = -(this.speedDy - Math.abs(dis2));
        }

        // 原路徑返回.
        if (dis < 0) {
            this.dx = -this.dx;
            this.dy = -this.dy;
        // 反彈.
        } else {
            this.dy = -this.dy;
        }
    }

}

//----------------------------------------------------------------------------
// 更新.
//----------------------------------------------------------------------------
GamePlay.prototype.update = function () {    

    // 10:開球模式.    
    if (this.gamePlayMode == 10) {
        // 球跟著板子.
        this.x = this.paddle.position.x;
        this.y = this.paddle.position.y - 26;
        this.ballMove(this.x, this.y, this.ball.position.z);

    // 11:遊戲模式.
    } else if (this.gamePlayMode == 11) {
        // 加速.
        if (this.counter == 0) {
            this.speedDx += 0.01;
            this.speedDy += 0.01;

            if (this.speedDx > 32) { this.speedDx = 32; }
            if (this.speedDy > 32) { this.speedDy = 32; }
        }

        // 移動球.
        if (this.x + this.dx > 444 || this.x + this.dx < -444) {
            this.aabbName = ""
            this.dx = -this.dx;
        }
        if (this.y + this.dy > 528 || this.y + this.dy < -528) {
            this.aabbName = ""
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.ballMove(this.x, this.y, this.ball.position.z);

        // 球掉落處理.
        if (this.y + this.dy > 528) {
            // 設定開球狀態.
            this.gamePlayMode = 10;

            // 初始速度.
            this.speedDx = 12;
            this.speedDy = 12;
            this.counter == 0

            // 球移動速度.
            this.dx =  this.speedDx;
            this.dy = -this.speedDy;
        }

        // 判斷球碰到版子.
        if (this.ballBBox.intersectsBox(this.paddleBBox)) {
            if (this.aabbName != this.paddleBBox.name) {
                //算出球根版子位置.
                var dis = this.paddle.position.x - this.ball.position.x;
                // 處理球反彈.
                this.ballBounce(dis);
                // 紀錄碰撞到的物件名稱.            
                this.aabbName = this.paddleBBox.name;
            }
        }

        // 判斷球碰磚塊.
        for (var i = 0; i < this.aabbList.length; i++) {
            if (this.ballBBox.intersectsBox(this.aabbList[i])) {
                if (this.aabbName != this.aabbList[i].name) {

                    //算出球根版子位置.
                    var dis = this.aabbList[i].obj.position.x - this.ball.position.x;
                    // 處理球反彈.
                    this.ballBounce(dis);

                    // 紀錄碰撞到的物件名稱.            
                    this.aabbName = this.aabbList[i].name;
                    // 關閉磚塊.
                    this.aabbList[i].obj.visible = false;
                    // 扣磚塊數量.
                    this.bricksMax--;
                    // 移除磚塊.
                    this.aabbList.splice(i, 1);

                    // 磚塊為0重新開始.
                    if (this.bricksMax <= 0) {
                        this.levelID++;
                        if (this.levelID > 8) { this.levelID = 1;}
                        this.resetGame(this.levelID);
                    }
                    break;
                }
            }
        }
    }

}