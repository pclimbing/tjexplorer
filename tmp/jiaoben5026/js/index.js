/*
This animation by FlawlessDog.com
Made possible by GreenSock Animation Platform (GSAP) v12 beta.
http://www.greensock.com/gsap-js/

This effect works great in modern browsers: Chrome, Safari, and FireFox.

IE does not support transform-style:preserve3d, so the 3D may look a little flat. 
Once again IE proves its ability to hinder progress and inflict pain on developers.
http://msdn.microsoft.com/en-us/library/ie/hh673529(v=vs.85).aspx#_3dtranslate
*/
var trans3DDemo1 = $("#trans3DDemo1"), 
    trans3DBoxes1 = $("#trans3DBoxes1"),// div containing all the the boxes
    boxes1 = $("#trans3DBoxes1 div"), // all the boxes
    threeDTimeline = new TimelineMax({onUpdate:updateCube, repeat:-1}),
	stageW = ($(window).width())/2,
	stageH = ($(window).height())/2,
	stageX = (stageW-(trans3DBoxes1.width()/2)),
	stageY = (stageH-(250/2));
//transformPerspective gives the element its own vanishing point
//perspective allows all the child elements (orange boxes) to share the same vanishing point with each other
//transformStyle:"preserve3d" allows the child elements to maintain their 3D position (noticeable only when their parent div is rotated in 3D space)
TweenMax.set(trans3DBoxes1, {css:{transformPerspective:3000, transformStyle:"preserve-3d"}}); //saves a dozen lines of vendor-prefixed css ;)
/*
K, lets build a cube and place it
boxes1[0] = frontside
boxes1[1] = leftside
boxes1[2] = rightside
boxes1[3] = topside
boxes1[4] = bottomside
boxes1[5] = backside
*/
threeDTimeline.set(boxes1[0], {rotationX:0, rotationY:0, x:0, y:0, z:125, opacity:0.85})
              .set(boxes1[1], {rotationX:0, rotationY:-90, x:-125, y:0, z:0, opacity:0.85})
			  .set(boxes1[2], {rotationX:0, rotationY:90, x:125, y:0, z:0, opacity:0.85})
			  .set(boxes1[3], {rotationX:90, rotationY:0, x:0, y:-125, z:0, opacity:0.85})
			  .set(boxes1[4], {rotationX:-90, rotationY:0, x:0, y:125, z:0, opacity:0.85})
			  .set(boxes1[5], {rotationX:0, rotationY:180, x:0, y:0, z:-125, opacity:0.85})
			  .set(trans3DBoxes1, {x:150, y:150, transformOrigin:"125px 125px 0px"});
// hover events

boxes1.each(function (index, element) {
			$(element).hover(over, out);
			function over(){
				TweenMax.to(element, 0.15, {opacity:0.33});
				//threeDTimeline.pause();
			}
			function out(){
				TweenMax.to(element, 0.15, {opacity:0.85});
				//threeDTimeline.play();
			}
});

//
threeDTimeline.to(trans3DBoxes1, 15, {css:{rotationY:360, rotationX:-720, transformOrigin:"125px 125px 0px"}, ease:Power0.easeNone});
//
function updateCube(){
	stageW = ($(window).width())/2;
	stageH = ($(window).height())/2;
	stageX = (stageW-(trans3DBoxes1.width()/2));
	stageY = (stageH-(250/2));
	TweenMax.to(trans3DBoxes1, 1, {css:{x:stageX, y:stageY}});
}
/*
Just a note:
I'm a bit bothered by the fact I can't seem to fetch the trans3DBoxes1.height() like I can with the width.
*/