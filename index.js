window.onload = ()=> {
    const width = 900;
    const height = 600;
    const size = 30;
    let ctx;
    let color = 0;
    let draw = false;
    let Points = [];
    let score1 = 0;
    let score2 = 0;
    const drawLines = ()=> {
        for (let i=1; i<(height/size); i++) {
            ctx.moveTo(0, i*size);
            ctx.lineTo(width, i*size);
        }
        for (let i=1; i<(width/size); i++) {
            ctx.moveTo(i*size, 0);
            ctx.lineTo(i*size, height);
        }
        ctx.stroke();
    }
    const drawPoint = (i, j)=> {
        if (Points[i][j][0]===null) {
            ctx.beginPath();
            Points[i][j][0] = color%2===0 ? 1 : 2;
            ctx.strokeStyle = color%2===0 ? "red" : "blue";
            ctx.arc(j*size, i*size, 4, 0,Math.PI*2, true);
            ctx.fill();
            ctx.stroke();
            color++;
        }
    }
    
    const Matrix = ()=> {
        const lenX = parseInt(width/size);
        const lenY = parseInt(height/size);
        for (let i = 0; i <= lenY+10; i++) {
            Points.push([]);
            for (let j = 0; j <= lenX+10; j++) {
                Points[i].push([null, false, false, false, false]);
            }
        }
    }
    
    const Lines = ()=> {
        const lenX = parseInt(width/size);
        const lenY = parseInt(height/size);
        for (let i = 0; i <= lenY; i++) {
            for (let j = 0; j <= lenX; j++) {
                let xDraw = true;
                let yDraw = true;
                let D = true;
                let DI = true;
                for (var kX = j; kX < (j+5) && kX <= (lenX+1); kX++) {
                    if (Points[i][kX][0]!==Points[i][j][0] || Points[i][kX][0]===null || Points[i][kX][1]===true) xDraw = false;
                }
                for (var kY = i; kY < (i+5) && kY <= (lenY+1); kY++) {
                    if (Points[kY][j][0]!==Points[i][j][0] || Points[kY][j][0]===null || Points[kY][j][2]===true) yDraw = false;
                }
                for (var kD = 0; kD < 5 && (kD+j) <= lenX && (kD+i) <= lenY; kD++) {
                    if (Points[i+kD][j+kD][0]!==Points[i][j][0] || Points[i+kD][j+kD][0]===null || (Points[i+kD][j+kD][3]===true) ||
                    (Points[i+kD][j+kD+1][4]===true && Points[i+kD+1][j+kD][4]===true && kD!==4 && 
                    (Points[i+kD][j+kD+1][0]!==Points[i+kD][j+kD][0] && Points[i+kD+1][j+kD][0]!==Points[i+kD][j+kD][0]))) D = false;
                }
                for (var kDI = 0; kDI < 5 && (kDI+j) <= lenX && (kDI+i) <= lenY; kDI++) {
                    if (Points[i+kDI][(j+4)-kDI][0]!==Points[i][j+4][0] || Points[i+kDI][(j+4)-kDI][0]===null || Points[i+kDI][(j+4)-kDI][4]===true ||
                    (j!==0 && Points[i+kDI][(j+3)-kDI][3]===true && Points[i+kDI+1][(j+4)-kDI][3]===true && kDI!==4 &&
                    (Points[i+kDI][(j+3)-kDI][0]!==Points[i+kDI][(j+4)-kDI][0] && Points[i+kDI+1][(j+4)-kDI][0]!==Points[i+kDI][(j+4)-kDI][0]))) DI = false;
                }
                ctx.beginPath();
                ctx.strokeStyle = Points[i][j][0]===1 ? "red" : "blue";
                if (xDraw) {
                    draw = true;
                    Points[i][j][0]===1 ? score1++ : score2++;
                    ctx.moveTo(j*size, i*size);
                    ctx.lineTo((kX-1)*size, i*size);
                    for (let k=j; k<(j+5); k++) {
                        Points[i][k][1]=true;
                    }
                }
                if (yDraw) {
                    Points[i][j][0]===1 ? score1++ : score2++;
                    ctx.moveTo(j*size, i*size);
                    ctx.lineTo(j*size, (kY-1)*size);
                    for (let k=i; k<(i+5); k++) {
                        Points[k][j][2]=true;
                    }
                }
                if (D && kD===5) {
                    Points[i][j][0]===1 ? score1++ : score2++;
                    ctx.moveTo(j*size, i*size);
                    ctx.lineTo((j+4)*size, (i+4)*size);
                    for (let k=0; k<5; k++) {
                        Points[i+k][j+k][3]=true;
                    }
                }
                if (DI && kDI===5) {
                    Points[i][j][0]===1 ? score2++ : score1++;
                    ctx.strokeStyle = Points[i][(j+4)][0]===1 ? "red" : "blue";
                    ctx.moveTo(j*size, (i+4)*size);
                    ctx.lineTo((j+4)*size, i*size);
                    for (let k=0; k<5; k++) {
                        Points[i+k][(j+4)-k][4]=true;
                    }
                }
                ctx.stroke();
                const id = Points[i][j][0]===1 ? "j1" : "j2";
                const sc = document.getElementById(id);
                sc.textContent = Points[i][j][0]===1 ? score1 : score2;
                if (xDraw || yDraw || (D && kD===5) || (DI && kDI===5)) {
                    color--;
                    draw = true;
                }
            }
        }
    }

    const rounds = ()=> {  
        const Jouer = document.getElementById('Jouer');
        Jouer.style.color = color%2===0? "red" : "blue";
        const rd = color%2===0? "J1" : "J2";
        Jouer.textContent = rd;
    }
    const init = ()=> {
        Matrix();
        const canvas = document.createElement('canvas');
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.style.float = "left";
        const score = document.createElement('h3');
        score.textContent = "Score";
        div.appendChild(score);
        const sc1 = document.createElement('p');
        sc1.style.color = "grey";
        sc1.textContent = "Jouer 1 : ";
        div.appendChild(sc1);
        const sp1 = document.createElement('span');
        sp1.id = "j1";
        sp1.style.color = "red";
        sp1.textContent = score1;
        sc1.appendChild(sp1);
        const sc2 = document.createElement('p');
        sc2.style.color = "grey";
        sc2.textContent = "Jouer 2 : ";
        div.appendChild(sc2);
        const sp2 = document.createElement('span');
        sp2.id = "j2";
        sp2.style.color = "blue";
        sp2.textContent = score2;
        sc2.appendChild(sp2);
        const round = document.createElement('h3');
        round.id = "round";
        round.textContent = "Tour : ";
        div.appendChild(round);
        const jouer = document.createElement('span');
        jouer.id = "Jouer";
        jouer.style.padding = "0px 3px";
        jouer.style.border = "1px solid grey";
        jouer.style.borderRadius = "2px";
        jouer.style.color = "red";
        jouer.style.fontSize = "17px";
        jouer.style.fontWeight = "bold";
        jouer.textContent = "J1";
        round.appendChild(jouer);
        canvas.width = width;
        canvas.height = height;
        canvas.style.border = "2px solid grey";
        canvas.style.borderRadius = "3px";
        canvas.style.display = "block";
        canvas.style.margin = "15px auto";
        ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);
        drawLines();
        canvas.onclick = (e)=> {
            const widthResp = parseInt(width+(size-15) - window.screen.width/2);
            const cursorX = parseInt((e.clientX-widthResp)/size);
            const cursorY = parseInt(e.clientY/size);
            drawPoint(cursorY, cursorX);
            Lines();
            if (draw)
                draw = false;
            else
                rounds();
        }
    }
    init();
}
