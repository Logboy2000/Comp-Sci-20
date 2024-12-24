class_name Coin
extends Area2D

@export var value: int = 1
@export var speed_range: float = 2
@export var deceleration: float = 0.2

var speed: Vector2 = Vector2(randf_range(-speed_range, speed_range), randf_range(-speed_range, speed_range))
var is_merging: bool = false  # Prevents duplicate merging

func _physics_process(_delta: float) -> void:
	if is_merging:
		return  # Skip movement if merging

	# Decelerate and move the coin
	speed = speed.move_toward(Vector2.ZERO, deceleration)
	position += speed

	# Check for overlapping coins
	for other in get_overlapping_areas():
		if other is Coin and other != self and not other.is_merging:
			merge_with(other)

func merge_with(other: Coin) -> void:
	if is_merging:
		return  # Prevent duplicate merging
	
	is_merging = true  # Mark this coin as merging

	# Combine values
	value += other.value

	# Mark the other coin as merging and queue free it
	other.is_merging = true
	other.queue_free()
	is_merging = false
	# Optionally, play a merge animation or effect here
