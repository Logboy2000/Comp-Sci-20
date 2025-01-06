extends Node

@export var object_scene: PackedScene
@export var pool_size: int = 100

var pool: Array[Node] = []

func _process(_delta: float) -> void:
	if GameManager.current_room != null and pool.is_empty():
		# Preload objects into the pool
		for i in range(pool_size):
			var obj = object_scene.instantiate()
			obj.process_mode = Node.PROCESS_MODE_DISABLED
			obj.visible = false
			GameManager.current_room.entities.add_child(obj)
			pool.append(obj)

func get_object() -> Node:
	# Find an inactive object in the pool
	for obj in pool:
		if not obj.is_inside_tree() or !obj.visible:
			obj.visible = true
			obj.process_mode = Node.PROCESS_MODE_INHERIT
			if obj.has_method("on_activate"):
				obj.on_activate()
			return obj
	
	print("Warning: Pool exhausted. Consider increasing pool size.")
	return null

func return_object(obj: Node) -> void:
	# Reset the object and return it to the pool
	if obj.has_method("on_deactivate"):
		obj.on_deactivate()
	obj.process_mode = Node.PROCESS_MODE_DISABLED
	
