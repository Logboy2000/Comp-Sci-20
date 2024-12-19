extends CanvasLayer

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var control: Control = $Control

func _ready() -> void:
	visible = false
	control.modulate = Color(255,255,255,0)
	GameManager.game_over_signal.connect(_game_over)

func _on_retry_pressed() -> void:
	TransitionLayer.change_scene("res://scenes/rooms/endless_mode.tscn")


func _on_title_pressed() -> void:
	TransitionLayer.change_scene("res://scenes/rooms/title_room.tscn")

func _game_over():
	GameManager.can_pause = false
	visible = true
	animation_player.play("appear")
