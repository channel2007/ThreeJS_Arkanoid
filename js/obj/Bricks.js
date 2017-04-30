/*****************************************************************************
 * 磚塊.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
// 建構子.
function Bricks() {
    // 磚塊.
    this.bricks = null;
}

//----------------------------------------------------------------------------
// 初始.
//----------------------------------------------------------------------------
Bricks.prototype.init = function (name, aabbName, aabbId) {
    // 建立Box物件.
    var geometry = new THREE.BoxGeometry( 80, 26, 26);

    // 設定Normal貼圖.
    var color = "";
    if (aabbId == 1) {
        color = "#D82800";      // 1.
    } else if (aabbId == 2) {
        color = "#0070EC";      // 2.
    } else if (aabbId == 3) {
        color = "#FC74B4";      // 3.
    } else if (aabbId == 4) {
        color = "#80D010";      // 4.
    } else if (aabbId == 5) {
        color = "#FC9838";      // 5.
    } else if (aabbId == 6) {
        color = "#FC7460";      // 6.
    } else if (aabbId == 7) {
        color = "#3CBCFC";      // 7.
    } else if (aabbId == 8) {
        color = "#FCFCFC";      // 8.
    }    
    var bricksMaterial = new THREE.MeshLambertMaterial({ "color": color });
    bricksMaterial.transparent = true;      // 開啟使用透明度.

    this.bricks = new THREE.Mesh(geometry, bricksMaterial);    
    this.bricks.name = name;
    this.bricks.geometry.computeBoundingBox();
    //this.bricks.castShadow = true;
    //this.bricks.material.color = new THREE.Color("#0070EC");  // 設定顏色.
    //this.bricks.material.opacity = 0.5;   // 設定透明度.

    // aabb.
    this.bricksBBox = new THREE.Box3(this.bricks.geometry.boundingBox.min, this.bricks.geometry.boundingBox.max);
    this.bricksBBox.name = aabbName;            // aab名稱.
    this.bricksBBox.obj = this.bricks;          // 磚塊物件.
    this.bricksBBox.bricksColor = aabbId;       // 磚塊顏色編號.

    return this.bricks;
}

//----------------------------------------------------------------------------
// 設定物件座標.
//----------------------------------------------------------------------------
Bricks.prototype.bricksMove = function (x, y, z) {
    this.bricks.position.x = x;
    this.bricks.position.y = y;
    this.bricks.position.z = z;

    this.bricksBBox.setFromObject(this.bricks);
}