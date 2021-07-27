// import { useState } from 'react';
// import { useSpring} from 'react-spring';
import styled from 'styled-components';
import logger from '../../lib/custom-logger/logger';
// import './styles.css';

const AnimationStyle = styled.div`

  // 깜빡임
  @keyframes test {
    12% {//12.5
      /* opacity: 1; */
      /* transform: scaleX( 1 ) , scaleY(1); */
    }
    18% {
      opacity: 0;
      transform: scale(0.8 , 0.7);
      background-color:blue;
    }
    50% {
      opacity: 1;
    }
    /* 53% {
      transform: scaleX( 0.8 ) , scaleY(0.7);
    } */
    100% {
      transform: scale(0.8 , 0.7);
      background-color:blue;
    }
  }

  @keyframes blink {
  }

  .test-active {
    animation: test 1.2s forwards;
    /* animation-name: test;
    animation-duration: 3s; */
    /* animation-direction: alternate; */
    /* animation-fill-mode: forwards; */
  }
`;
function test(e:HTMLDivElement , ranColor:string){
  // var originalWidth = e.clientWidth
  // var originalHeight = e.clientHeight
  // const parent = e.parentElement as HTMLDivElement;

  let time = 0
  // let hammerOnscreen = false
  function hammer() {
    time += 1; // 0.01 초

    
    e.style.backgroundColor = ranColor
    if (time >= 100) {
      window.clearInterval(intervalIdx);
    }
  }
  const intervalIdx = window.setInterval(hammer,10)
}
function SpringDemo() {
  // const anistart = ()=>{
  //   console.log('start')
  //   // const div = (document.getElementById("hihi-test") as HTMLDivElement)
  // }
  // const aniend = ()=>{
  //   const div = (document.getElementById("hihi-test") as HTMLDivElement)
  //   console.log(div.style.width , div.clientWidth)
  //   // div.style.width = div.clientWidth + "px";
  //   // div.style.height = div.clientHeight + "px";
  //   div.style.animationPlayState = "paused"
  //   div.classList.remove("test-active")
  //   div.removeEventListener("animationstart" , anistart)
  //   div.removeEventListener("animationend" , aniend)
  // }
  return (
    <div onClick={() => {
      const e = (document.getElementById("hihi-test") as HTMLDivElement)
      // e.classList.add("test-active")
      // e.addEventListener("animationstart", anistart, false);
      // e.addEventListener("animationend", aniend, false);
      // e.addEventListener("animationiteration", ()=>console.log('iter'), false);
      const colorList = ["#6ca8ff" , "#ff6ee8" , "#ffd41e" , "#716df9" , "#50e3c2"]
      const ranColor = colorList[Math.floor(Math.random()*5)]
      logger(e.style.backgroundColor,typeof e.style.backgroundColor)
      test(e , ranColor)
      
    }} style={{ position: "absolute", top: 100, left: 0}}>
      <AnimationStyle>
        {/* <div id="hihi-test" style={{width:"320px", height:"100px", backgroundColor: "red"}}> */}
        <div id="hihi-test" style={{width:"320px", height:"100px"}}>
          hihi
        </div>
        <canvas id="canvas" width="600" height="300"></canvas>
      </AnimationStyle>
    </div>
  )
}

export default SpringDemo


/*
var canvas = document.getElementById('canvas') as HTMLCanvasElement;
      var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      var raf:number;

      var ball = {
        x: 100,
        y: 100,
        vx: 5,
        vy: 2,
        radius: 25,
        color: 'blue',
        draw: function() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      };
      
      function draw() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ball.draw();
        ball.x += ball.vx;
        ball.y += ball.vy;
        raf = window.requestAnimationFrame(draw);
      }
      
      canvas.addEventListener('mouseover', function(e) {
        raf = window.requestAnimationFrame(draw);
      });
      
      canvas.addEventListener('mouseout', function(e) {
        window.cancelAnimationFrame(raf);
      });
      
      ball.draw();
*/