// import * as THREE from '../../libs/three.weapp.js'
// import { OrbitControls } from '../../libs/OrbitControls.js'
// import GLTF from '../../libs/GLTFLoader.js'
 
// // 场景，相机，渲染器，控制器
// let scene, camera, renderer, controls, canvas, textureGuangzhouta
 
// // gltf加载器
// let GLTFloader = GLTF(THREE)
// const loader = new GLTFloader()
 
// Page({
//   data: {
//     canvasId: null,
//     testUrl: 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf'
//   },
 
//   // 将微信dom和three.js绑定
//   bindThree() {
//     wx.createSelectorQuery()
//       .select('#c')
//       .node()
//       .exec((res) => {
//         let canvasId = res[0].node._canvasId
//         canvas = THREE.global.registerCanvas(canvasId, res[0].node)
//         this.setData({ canvasId })
//         this.init()
//       })
//   },
 
//   // 初始化场景
//   initScene() {
//     scene = new THREE.Scene()
//     // scene.background = new THREE.Color(0xffffff)
//     //灯光 黄光环境
//     scene.add(new THREE.AmbientLight(0xffffff))
//     scene.background = new THREE.Color(0xaa000000)
//   },
 
//   // 初始化相机
//   initCamera() {
//     camera = new THREE.PerspectiveCamera(
//       75,
//       canvas.width / canvas.height,
//       0.1,
//       4000
//     )
//     camera.position.set(0, 700, 1700)
//     // camera.lookAt(0, 0, 0)
//   },
 
//   // 初始化渲染器
//   initRenderer() {
//     renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(
//       wx.getSystemInfoSync().windowWidth,
//       wx.getSystemInfoSync().windowHeight
//     )
//   },
 
//   // 初始化控制器
//   initControls() {
//     controls = new OrbitControls(camera, renderer.domElement)
//     controls.enableDamping = true // 设置阻尼，需要在 update 调用
//   },
 
 
 
//   // 添加测试模型
//   addGuangzhouta() {
 
//     loader.load(this.data.testUrl, (gltf) => {
    
 
//       // 位置更正
//       gltf.scene.position.set(200, 580, -700)
//       gltf.scene.scale.set(2, 2, 2)
//       scene.add(gltf.scene)
//     })
//   },
 
 
 
//   // 动画帧函数
//   animate() {
//     canvas.requestAnimationFrame(this.animate)
 
//     if (textureGuangzhouta) {
//       textureGuangzhouta.offset.y -= 0.009
//       // console.log(textureGuangzhouta.offset.y)
//       if (textureGuangzhouta.offset.y < -0.5) {
//         textureGuangzhouta.offset.y = 0
//       }
//     }
//     controls.update()
//     renderer.render(scene, camera)
//   },
 
//   // 初始化函数
//   init() {
//     this.initScene()
//     this.initCamera()
//     this.initRenderer()
//     this.initControls()
//     this.addGuangzhouta()
//     this.onWindowResize()
//     this.animate()
//   },
 
//   // 页面自适应
//   onWindowResize() {
//     console.log(canvas.width)
//     // camera.aspect = window.innerWidth / window.innerHeight
//     camera.aspect =
//       wx.getSystemInfoSync().windowWidth / wx.getSystemInfoSync().windowHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(canvas.width, canvas.height)
//   },
 
//   // 生命周期函数：小程序初始化完成时触发，全局只触发一次
//   onLoad: function () {
//     this.bindThree()
//   },
//   onUnload: function () {
//     //清理global中的canvas对象
//     THREE.global.clearCanvas()
 
//     THREE.global.unregisterCanvas(this.data.canvasId)
//   },
 
// })
