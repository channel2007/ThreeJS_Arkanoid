/*****************************************************************************
 * �j��.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
// �غc�l.
function Bricks() {
    // �j��.
    this.bricks = null;
}

//----------------------------------------------------------------------------
// ��l.
//----------------------------------------------------------------------------
Bricks.prototype.init = function (name, aabbName, aabbId) {
    // �إ�Box����.
    var geometry = new THREE.BoxGeometry( 80, 26, 26);

    // �]�wNormal�K��.
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
    bricksMaterial.transparent = true;      // �}�Ҩϥγz����.

    this.bricks = new THREE.Mesh(geometry, bricksMaterial);    
    this.bricks.name = name;
    this.bricks.geometry.computeBoundingBox();
    //this.bricks.castShadow = true;
    //this.bricks.material.color = new THREE.Color("#0070EC");  // �]�w�C��.
    //this.bricks.material.opacity = 0.5;   // �]�w�z����.

    // aabb.
    this.bricksBBox = new THREE.Box3(this.bricks.geometry.boundingBox.min, this.bricks.geometry.boundingBox.max);
    this.bricksBBox.name = aabbName;            // aab�W��.
    this.bricksBBox.obj = this.bricks;          // �j������.
    this.bricksBBox.bricksColor = aabbId;       // �j���C��s��.

    return this.bricks;
}

//----------------------------------------------------------------------------
// �]�w����y��.
//----------------------------------------------------------------------------
Bricks.prototype.bricksMove = function (x, y, z) {
    this.bricks.position.x = x;
    this.bricks.position.y = y;
    this.bricks.position.z = z;

    this.bricksBBox.setFromObject(this.bricks);
}