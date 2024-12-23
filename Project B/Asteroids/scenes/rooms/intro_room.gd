extends Node2D

func _ready() -> void:
	if GameManager.save.get("played_tutorial"):
		TransitionLayer.change_scene("res://scenes/rooms/title_room.tscn")
	else:
		TransitionLayer.change_scene("res://scenes/rooms/tutorial_room.tscn")
