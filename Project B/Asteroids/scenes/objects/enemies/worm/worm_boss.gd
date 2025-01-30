class_name WormBoss
extends Node2D

@export var worm_segment_count: int = 5  # MUST BE ODD
@export var part_separation: int = 16
const WORM_PART = preload("res://scenes/objects/enemies/worm/worm_part.tscn")

var worm_parts: Array = []

func _ready() -> void:
	worm_segment_count = (GameManager.difficulty * 2) + 1
	for i in range(worm_segment_count):
		var part
		if i % 2 == 0:
			part = WORM_PART.instantiate()
			if i == 0:
				part.follow_player = true
				part.follow_speed = 10
				part.modulate = Color(1,0,0)
			else:
				part.follow_player = false
				part.follow_speed = 0
		else:
			part = PinJoint2D.new()
			part.softness = 0.5
			part.disable_collision = false
		
		part.position = Vector2(i * part_separation, 0)
		add_sibling.call_deferred(part)
		worm_parts.append(part)
	
	for i in worm_parts.size():
		var part = worm_parts[i]
		if part is PinJoint2D:
			part.node_a = worm_parts[i-1].get_path()
			part.node_b = worm_parts[i+1].get_path()
	
	call_deferred("queue_free")
