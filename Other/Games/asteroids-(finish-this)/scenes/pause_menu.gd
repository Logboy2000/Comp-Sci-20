extends CanvasLayer

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var label: Label = $Control/Panel/VBoxContainer/Label

func _ready() -> void:
	visible = false

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("pause"):
		toggle_pause()



func _on_quit_pressed() -> void:
	GameManager.quit_game()


func _on_return_to_title_pressed() -> void:
	TransitionLayer.change_scene("res://scenes/rooms/title_room.tscn")


func _on_resume_pressed() -> void:
	toggle_pause()


func toggle_pause():
	get_tree().paused = !get_tree().paused
	if get_tree().paused:
		animation_player.play("enter")
	else:
		animation_player.play("exit")
