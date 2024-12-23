class_name Room
extends Node2D

const zoom_mult = 1.1
const max_zoom = 10
const min_zoom = 0.5
@onready var entities: Node2D = $Entities
@onready var camera: Node2D = $ProCam2D
@onready var game_over_screen: CanvasLayer = $GameOverScreen

func _ready() -> void:
	GameManager.current_room = self
	DebugMenu.modify_label("room", "Room: " + name)
	

func _process(_delta: float) -> void:
	DebugMenu.modify_label("node_count", "Entities: " + str(entities.get_child_count()))
	if Input.is_action_just_pressed("zoom_in"):
		var target_zoom = camera.zoom * zoom_mult
		if target_zoom > max_zoom:
			camera.zoom = max_zoom
		else:
			camera.zoom = target_zoom
		GameManager.set_cam_zoom(target_zoom)
	
	if Input.is_action_just_pressed("zoom_out"):
		var target_zoom = camera.zoom / zoom_mult
		if target_zoom < min_zoom:
			camera.zoom = min_zoom
		else:
			camera.zoom = target_zoom
		GameManager.set_cam_zoom(target_zoom)
	
