
window.addEventListener("load", function () {

  var r=3;
  var s_r=r/20+Math.sin(0)*r/20;
  var num_of_corners=2;
  var obj_resolution=360;

  
  var _w=window.innerWidth;
  var _h=window.innerHeight;
  var aspect = _w/ _h;
  var scene = new THREE.Scene(); 
  var camera = new THREE.PerspectiveCamera( 65,  _w/_h, 0.1, 1000 );
  camera.position.z = 10; 
  var renderer = new THREE.WebGLRenderer({ antialias: true } ); 
  renderer.setClearColor(new THREE.Color(0x221f26, 1.0));
  renderer.setSize( _w, _h ); 

  document.body.appendChild( renderer.domElement );



  var group = new THREE.Object3D();
  var sub_group = new THREE.Object3D();
  var all_vertices=[];
  var all_sub_vertices=[];



  var objects=[];
  var sub_objects=[];
  var num=7;
  var dstnc=0.4;
  var border=0.04;

  // generate bottom layer of mesh

  for(var i=0;i<num;i++){
    var obj=create_mesh(0x66b8c6,1,all_vertices);
    objects.push(obj);
    sub_group   .add(obj);
    obj.position.y=-(-num/2*dstnc+ dstnc*i);
    obj.position.z=-(-num/2*dstnc+ dstnc*i+0.1);
    obj.rotation.y =Math.PI/180*180;
  } 

  // generate top layer of mesh
  for(var i=0;i<num;i++){
    var obj=create_mesh(0x221f26,1-border,all_sub_vertices);
    sub_objects.push(obj);
    group   .add(obj);
    obj.position.y=-(-num/2*dstnc+ dstnc*i);
    obj.rotation.y =Math.PI/180*180;
    obj.position.z=-(-num/2*dstnc+ dstnc*i);
  }  

  group.rotation.x = sub_group.rotation.x = Math.PI/180*340;
  scene.add(group);
  scene.add(sub_group);

  function create_mesh(clr,r_coof,ver_arr){
    var geometry = new THREE.BufferGeometry();
    var points=generate_points(r,s_r,5);
    var vertices = give_me_vertices(points);
    ver_arr.push(vertices);
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: clr } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.anim_shape=5;
    mesh.anim=-1;
    mesh.r_coof=r_coof;

    return mesh;
  }

  function generate_points(r,s_r,anim_shape){
    var points=[];
    for (var i = 0; i <=  obj_resolution; i++) {
      var angle=Math.PI/180*i;
      var addx=0;
      var addy=0;

      addx=s_r*Math.sin(angle*anim_shape);
      addy=s_r*Math.sin(angle*anim_shape);


      var x = (r+addx) * Math.cos(angle);
      var y = (r+addy) * Math.sin(angle);
      var z=0;

      points.push([x,y,z]);

    }
    return points;
  }

  function give_me_vertices(points){

   var vertexPositions=[];
   var center_point=[0,0,0];

   for (var i = 0; i <  points.length-1; i++) {
    vertexPositions.push(points[i],center_point,points[i+1]);
  }
  vertexPositions.push(points[ points.length-1],center_point,points[0]);
  vertexPositions.push(points[1],center_point,points[2]);
  vertices = new Float32Array( vertexPositions.length * 3 ); 



  for ( var i = 0; i < vertexPositions.length; i++ )
  {
    vertices[ i*3 + 0 ] = vertexPositions[i][0];
    vertices[ i*3 + 1 ] = vertexPositions[i][1];
    vertices[ i*3 + 2 ] = vertexPositions[i][2];
  }

  return vertices;
}

function update_vertices(points,my_arr){


 var vertexPositions=[];
 var center_point=[0,0,0];

 for (var i = 0; i <  points.length-1; i++) {
  vertexPositions.push(points[i],center_point,points[i+1]);
}
vertexPositions.push(points[ points.length-1],center_point,points[0]);
vertexPositions.push(points[1],center_point,points[2]);



for ( var i = 0; i < vertexPositions.length; i++ ){
  my_arr[ i*3 + 0 ] = vertexPositions[i][0];
  my_arr[ i*3 + 1 ] = vertexPositions[i][1];
  my_arr[ i*3 + 2 ] = vertexPositions[i][2];
}

}


var last_anim=false;
var delay_time=0.3;
var anim_time=2.12;
var rot_angle=90;
function tween(){

  num_of_corners++;
  if(num_of_corners>10)   num_of_corners=3;
  num_of_corners=Math.floor(Math.random()*9)+3;

  for (var k = objects.length-1; k >=  0; k--) {
    var prev_rot=Math.PI/180*(rot_angle+(k));
    var new_rot=prev_rot+Math.PI/180*(rot_angle);
    var l_delay=delay_time*(k);
    anim_delay(l_delay,k,prev_rot,new_rot);

  }

  setTimeout(tween,anim_time*1000);

  function anim_delay(l_delay,k,prev_rot,new_rot){
    setTimeout(re_anim,l_delay*1000);
    function re_anim(){
      objects[k].anim_shape=num_of_corners;
      sub_objects[k].anim_shape=num_of_corners;
      TweenMax.fromTo(objects[k].rotation,anim_time*2,{z:prev_rot},{ease:Sine.EaseInOut,z:new_rot});
      TweenMax.fromTo(objects[k],anim_time/2,{anim:-1},{ease:Sine.EaseOut,anim:1,onCompleteParams:[objects[k]],onComplete:tweenBack});
      TweenMax.fromTo(sub_objects[k].rotation,anim_time*2,{z:prev_rot},{ease:Sine.EaseInOut,z:new_rot});
      TweenMax.fromTo(sub_objects[k],anim_time/2,{anim:-1},{ease:Sine.EaseOut,anim:1,onCompleteParams:[sub_objects[k]],onComplete:tweenBack});
    }
  }
  function tweenBack(obj){
   TweenMax.fromTo(obj,anim_time/2,{anim:1},{ease:Sine.EaseIn,anim:-1});
 }
}
var counter=0;
var loop = function loop() {
  requestAnimationFrame(loop);

  for (var k = 0; k <  objects.length; k++) {
    var time=(counter+k)/60;
    var time_sin=Math.sin(time*4);

    var obj=objects[k];
    var rad=r*obj.r_coof;
    s_r=rad/15+obj.anim*rad/15;
    var points=generate_points(rad,s_r,obj.anim_shape); 
    update_vertices(points, all_vertices[k]);
    obj.geometry.attributes.position.needsUpdate = true;

    obj=sub_objects[k];
    rad=r*obj.r_coof;
    s_r=rad/15+obj.anim*rad/15;
    var points=generate_points(rad,s_r,obj.anim_shape); 
    update_vertices(points,all_sub_vertices[k]);
    obj.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
  counter++;

};





loop();
tween();

}, false);


