class_name Coin
extends RigidBody2D

@export var value: int = 1
@export var speed_range: float = 200

func _ready() -> void:
	_pulled_from_pool()

func _pulled_from_pool() -> void:
	linear_velocity = Vector2(randf_range(-speed_range, speed_range), randf_range(-speed_range, speed_range))
	angular_velocity = randf_range(-20, 20)
	collision_layer = 2
	


func _returned_to_pool() -> void:
	linear_velocity = Vector2(0,0)
	collision_layer = 0
