class_name ObjectPool extends Node2D

@export var object_scene: PackedScene
var object_pool: Array = []
@export var starting_size: int = 15

func _ready() -> void:
	for i in range(starting_size):
		add_new_object()

func add_to_pool(object: Node2D) -> void:
	object_pool.append(object)
	object.set_process(false)
	object.set_physics_process(false)
	object.hide()
	object.global_position = Vector2(-100,-100)

func pull_from_pool() -> Node2D:
	var object: Node2D
	if object_pool.is_empty():
		add_new_object()
		object = object_pool.pop_back()
	else:
		object = object_pool.pop_back()
	object.set_process(true)
	object.set_physics_process(true)
	object.show()
	if object.has_method("_pulled_from_pool"):
		object._pulled_from_pool()
	return object

func add_new_object():
	var object = object_scene.instantiate()
	add_child(object)  # Add to the scene tree first
	add_to_pool(object)  # Then deactivate and hide
