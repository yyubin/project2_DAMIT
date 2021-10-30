var canvas = document. getElementById ( "draw-canavas" );
var context = canvas. getContext ( "2d" );

context.lineWidth = 3; // 컨버스에 그리는 라인의 두께 설정
context.strokeStyle = "#006cb7"
var drag = false ;
canvas.addEventListener ( "mousedown" , function (me) {
    mDown (me)}, false );
canvas.addEventListener ( "mousemove" , function (me) {
    mMove (me)}, false );
canvas.addEventListener ( "mouseup" , function (me) {
    mUp (me)}, false );
canvas.addEventListener ( "mouseout" , function (me) {
    mOut (me)}, false );


function mMove(me)
{
//drag가 false 일때는 return(return 아래는 실행 안함)
    if (!drag)
    {
        return ;
    }
//마우스를 움직일 때마다 X좌표를 nowX에 담음
    var nowX = me. offsetX ;
//마우스를 움직일 때마다 Y좌표를 nowY에 담음
    var nowY = me. offsetY ;
//실질적으로 캔버스에 그림을 그리는 부분
    canvasDraw (nowX,nowY);
//마우스가 움직일때마다 X좌표를 stX에 담음
    stX = nowX;
//마우스가 움직일때마다 Y좌표를 stY에 담음
    stY = nowY;
}

function mDown(me)
{
    startX = me.offsetX;
    startY = me.offsetY;
    stX = me. offsetX ; //눌렀을 때 현재 마우스 X좌표를 stX에 담음
    stY = me. offsetY ; //눌렀을 때 현재 마우스 Y좌표를 stY에 담음
    drag = true ; //그림 그리기는 그리는 상태로 변경
}

function mUp(me)
{
    endX = me.offsetX
    endY = me.offsetY
    // context.strokeRect(startX,startY,endX-startX,endY-startY)
    drag = false ; //마우스를 떼었을 때 그리기 중지
}
function mOut(me)
{
    drag = false ; //마우스가 캔버스 밖으로 벗어났을 때 그리기 중지
}

function canvasDraw(currentX,currentY)
{
 context.clearRect(0,0,context.canvas.width,context.canvas.height) //설정된 영역만큼 캔버스에서 지움
 context.strokeRect(startX,startY,currentX-startX,currentY-startY) //시작점과 끝점의 좌표 정보로 사각형을 그려준다.
}