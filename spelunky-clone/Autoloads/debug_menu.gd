extends Control

var player_state = ''

@onready var label: Label = $Label

func _physics_process(_delta: float) -> void:
	label.text = str(player_state)
