/*****************************************************************************
 * AI.
 * 
 * created  by channel
 * 
 * todo list:
 *  
 * note:
 *
****************************************************************************/
function AI(gamePlay) {
    // 遊戲GamePlay指標.
    var pGamePlay = gamePlay;
    // 遊戲時脈.
    var gameClock = new THREE.Clock();
    var gameClockOldT = 0;

    //----------------------------------------------------------------------------
    // 更新.
    //----------------------------------------------------------------------------
    this.update = function () {
        gameClockOldT += gameClock.getDelta();

        // GamePlay-開球模式.
        if (pGamePlay.gamePlayMode == 10) {
            // 設定1秒後進入遊戲模式.
            if (gameClockOldT > 1.0) {
                pGamePlay.gamePlayMode = 11;
                gameClockOldT = 0;
            }

        // GamePlay-遊戲模式.
        } else if (pGamePlay.gamePlayMode == 11) {
            gameClockOldT = 0;
            pGamePlay.paddleMove(pGamePlay.ball.position.x, pGamePlay.paddle.position.y, pGamePlay.paddle.position.z);
        }
    }
}