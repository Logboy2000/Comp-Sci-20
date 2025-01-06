class_name Coin
extends RigidBody2D

@export var value: int = 1
@export var speed_range: float = 200

func _ready() -> void:
	linear_velocity = Vector2(randf_range(-speed_range, speed_range), randf_range(-speed_range, speed_range))
	angular_velocity = randf_range(-20, 20)
