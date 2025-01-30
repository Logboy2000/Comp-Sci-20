class_name ObjectPool extends Node2D
@export_category("i fucking hate object pooling")
@export var object_scene: PackedScene
@export var starting_size: int = 0

var object_pool: Array = []

func _ready() -> void:
	for i in range(starting_size):
		add_new_object()

func add_to_pool(object: Node2D) -> void:
	object_pool.append(object)
	object.set_process(false)
	object.set_physics_process(false)
	object.hide()
	if object.has_method("_returned_to_pool"):
		object.call("_returned_to_pool")

func pull_from_pool() -> Node2D:
	if object_pool.is_empty():
		add_new_object()
	var object: Node2D = object_pool.pop_back()
	object.set_process(true)
	object.set_physics_process(true)
	object.show()
	if object.has_method("_pulled_from_pool"):
		object.call("_pulled_from_pool")
	return object

func add_new_object() -> void:
	var object: Node2D = object_scene.instantiate() as Node2D
	add_child(object)
	add_to_pool(object)
