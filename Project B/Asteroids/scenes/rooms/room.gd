class_name Room
extends Node2D

const zoom_mult = 1.1
const max_zoom = 10
const min_zoom = 0.5

@onready var entities: Node2D = $Entities
@onready var camera: Node2D = $ProCam2D
@onready var game_over_screen: CanvasLayer = $UI/GameOverScreen
@onready var bg: Node2D = $BG
@onready var fg: Node2D = $FG

@onready var bottom_bound: StaticBody2D = $RoomBounds/BottomBound
@onready var top_bound: StaticBody2D = $RoomBounds/TopBound
@onready var left_bound: StaticBody2D = $RoomBounds/LeftBound
@onready var right_bound: StaticBody2D = $RoomBounds/RightBound

@export var room_size: Vector2 = Vector2(2000,2000)

func _ready() -> void:
	bg.visible = GameManager.settings.get("show_bg")
	fg.visible = GameManager.settings.get("show_bg")
	GameManager.current_room = self
	DebugMenu.modify_label("room", "Room: " + name)
	GameManager.coins = 0
	Upgrades.reset_all()
	
	right_bound.position.x = room_size.x
	bottom_bound.position.y = room_size.y
	
	camera.left_limit = left_bound.position.x
	camera.right_limit = right_bound.position.x
	camera.top_limit = top_bound.position.y
	camera.bottom_limit = bottom_bound.position.y
	
	camera.zoom = 1

func _process(_delta: float) -> void:
	DebugMenu.modify_label("node_count", "Entities: " + str(entities.get_child_count()))
	DebugMenu.modify_label("cam_zoom", "Zoom " + str(camera.zoom))
	if Input.is_action_just_pressed("zoom_in"):
		var target_zoom = camera.zoom * zoom_mult
		if target_zoom > max_zoom:
			GameManager.set_cam_zoom(max_zoom)
		else:
			GameManager.set_cam_zoom(target_zoom)
		
	
	if Input.is_action_just_pressed("zoom_out"):
		var target_zoom = camera.zoom / zoom_mult
		if target_zoom < min_zoom:
			GameManager.set_cam_zoom(min_zoom)
		else:
			GameManager.set_cam_zoom(target_zoom)
		
	camera.global_debug_draw = GameManager.debug_mode

func add_entity(entity: Node):
	entities.add_child(entity)

@onready var bullet_pool: ObjectPool = $BulletPool
