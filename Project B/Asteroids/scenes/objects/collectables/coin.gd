class_name Coin extends Area2D

@export var value: int = 1
@export var speed_range: float = 2
@export var deceleration: float = 0.2

var speed: Vector2 = Vector2(randf_range(-speed_range, speed_range), randf_range(-speed_range, speed_range))

func _physics_process(_delta: float) -> void:
	speed = speed.move_toward(Vector2.ZERO, deceleration)
	position += speed
	

func _on_timer_timeout() -> void:
	queue_free()
