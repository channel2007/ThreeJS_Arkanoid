/*****************************************************************************
 * �C��GamePlay.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
// �غc�l.
function GamePlay(scene, x, y) {
    // ������������.
    this.scene = scene;

    // �]�w-�O�l����.
    this.paddleLen = 120;

    // �j����l��m.
    this.mx = -415;
    this.my = -400;

    // �y��m.
    this.x = 0;
    this.y = 0;

    // 10:�}�y�Ҧ�.
    // 11:�C���Ҧ�.
    this.gamePlayMode = 10;

    // ���d.
    this.levelID = 1;

    // �ޥd�޲z��.
    this.levelManager = new LevelManager();

    //------------------------------------------------------------------------
    // ����.
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
    // ���l.
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
    // �y.
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
// ��l�C��.
//----------------------------------------------------------------------------
GamePlay.prototype.resetGame = function (id) {

    // �j���ƶq.
    this.bricksMax = 0;
    this.aabbList = [];
    this.aabbName = "";

    // �]�w�}�y�Ҧ�.
    this.gamePlayMode = 10;

    // ��l�t��.
    this.speedDx = 12;
    this.speedDy = 12;
    this.counter == 0

    // �y���ʳt��.
    this.dx =  this.speedDx;
    this.dy = -this.speedDy;

    // �j���}�C(11x15).
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
// �B�z�y�ϼu.
//----------------------------------------------------------------------------
GamePlay.prototype.ballBounce = function (dis) {
    // �̥�����m��X�y���װ���.
    var dis1 = Math.abs(dis);
    if (dis1 > (this.paddleLen >> 1)) { dis1 = (this.paddleLen >> 1); }
    var dis2 = (3 - (dis1 / 10)) * 1.8;    

    // 1.�k�U.
    if (this.dx > 0 && this.dy >= 0) {
        // ��X���ʰ���.
        if (dis2 < 0) {
            this.dx = this.speedDx + Math.abs(dis2);
            this.dy = this.speedDy - Math.abs(dis2);
        } else {
            this.dx = this.speedDx - Math.abs(dis2);
            this.dy = this.speedDy + Math.abs(dis2);
        }

        // �ϼu.
        if (dis < 0) {
            this.dy = -this.dy;
        // ����|��^.
        } else {
            this.dx = -this.dx;
            this.dy = -this.dy;
        }

    // 2.���U.
    } else if (this.dx < 0 && this.dy >= 0) {
        // ��X���ʰ���.
        if (dis2 < 0) {
            this.dx = -(this.speedDx + Math.abs(dis2));
            this.dy = (this.speedDy - Math.abs(dis2));
        } else {
            this.dx = -(this.speedDx - Math.abs(dis2));
            this.dy = (this.speedDy + Math.abs(dis2));
        }

        // ����|��^.
        if (dis < 0) {
            this.dx = -this.dx;
            this.dy = -this.dy;
        // �ϼu.
        } else {
            this.dy = -this.dy;
        }

    // 3.���W.
    } else if (this.dx > 0 && this.dy <= 0) {
        // ��X���ʰ���.
        if (dis2 < 0) {
            this.dx =   this.speedDx - Math.abs(dis2);
            this.dy = -(this.speedDy + Math.abs(dis2));
        } else {
            this.dx =   this.speedDx + Math.abs(dis2);
            this.dy = -(this.speedDy - Math.abs(dis2));
        }

        // �ϼu.
        if (dis < 0) {
            this.dy = -this.dy;
        // ����|��^.
        } else {
            this.dx = -this.dx;
            this.dy = -this.dy;
        }

    // 4.�k�W.
    } else if (this.dx < 0 && this.dy <= 0) {
        // ��X���ʰ���.
        if (dis2 < 0) {
            this.dx = -(this.speedDx - Math.abs(dis2));
            this.dy = -(this.speedDy + Math.abs(dis2));
        } else {
            this.dx = -(this.speedDx + Math.abs(dis2));
            this.dy = -(this.speedDy - Math.abs(dis2));
        }

        // ����|��^.
        if (dis < 0) {
            this.dx = -this.dx;
            this.dy = -this.dy;
        // �ϼu.
        } else {
            this.dy = -this.dy;
        }
    }

}

//----------------------------------------------------------------------------
// ��s.
//----------------------------------------------------------------------------
GamePlay.prototype.update = function () {    

    // 10:�}�y�Ҧ�.    
    if (this.gamePlayMode == 10) {
        // �y��۪O�l.
        this.x = this.paddle.position.x;
        this.y = this.paddle.position.y - 26;
        this.ballMove(this.x, this.y, this.ball.position.z);

    // 11:�C���Ҧ�.
    } else if (this.gamePlayMode == 11) {
        // �[�t.
        if (this.counter == 0) {
            this.speedDx += 0.01;
            this.speedDy += 0.01;

            if (this.speedDx > 32) { this.speedDx = 32; }
            if (this.speedDy > 32) { this.speedDy = 32; }
        }

        // ���ʲy.
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

        // �y�����B�z.
        if (this.y + this.dy > 528) {
            // �]�w�}�y���A.
            this.gamePlayMode = 10;

            // ��l�t��.
            this.speedDx = 12;
            this.speedDy = 12;
            this.counter == 0

            // �y���ʳt��.
            this.dx =  this.speedDx;
            this.dy = -this.speedDy;
        }

        // �P�_�y�I�쪩�l.
        if (this.ballBBox.intersectsBox(this.paddleBBox)) {
            if (this.aabbName != this.paddleBBox.name) {
                //��X�y�ڪ��l��m.
                var dis = this.paddle.position.x - this.ball.position.x;
                // �B�z�y�ϼu.
                this.ballBounce(dis);
                // �����I���쪺����W��.            
                this.aabbName = this.paddleBBox.name;
            }
        }

        // �P�_�y�I�j��.
        for (var i = 0; i < this.aabbList.length; i++) {
            if (this.ballBBox.intersectsBox(this.aabbList[i])) {
                if (this.aabbName != this.aabbList[i].name) {

                    //��X�y�ڪ��l��m.
                    var dis = this.aabbList[i].obj.position.x - this.ball.position.x;
                    // �B�z�y�ϼu.
                    this.ballBounce(dis);

                    // �����I���쪺����W��.            
                    this.aabbName = this.aabbList[i].name;
                    // �����j��.
                    this.aabbList[i].obj.visible = false;
                    // ���j���ƶq.
                    this.bricksMax--;
                    // �����j��.
                    this.aabbList.splice(i, 1);

                    // �j����0���s�}�l.
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