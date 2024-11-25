extends Control

@onready var button_container = $VBoxContainer
var room_dir: String = "res://scenes/rooms/"
var room_list: Array = []

func _ready() -> void:
	# Get all room paths
	var dir = DirAccess.open(room_dir)
	if dir:
		dir.list_dir_begin()
		var file_name = dir.get_next()
		while file_name != "":
			if dir.current_is_dir():
				print("Found directory: " + file_name)
			else:
				if file_name.get_extension() == "tscn":
					var full_path = room_dir.path_join(file_name)
					room_list.append(full_path)
					print(full_path)
			file_name = dir.get_next()
	else:
		printerr("An error occurred when trying to access room list.")
	for room in room_list:
		var new_button = Button.new()
		new_button.text = room.get_file()
		new_button.connect("pressed", Callable(self, "_on_button_pressed").bind(room_list.find(room)))  # Connect button press to function
		button_container.add_child(new_button)

func _on_button_pressed(room_index: int) -> void:
	TransitionLayer.change_scene(room_list[room_index])
