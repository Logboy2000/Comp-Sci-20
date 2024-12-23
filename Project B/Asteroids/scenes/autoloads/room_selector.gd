extends Control

@onready var button_container = $VBoxContainer
var room_dir: String = "res://scenes/rooms/"
var room_list: Array = []

func _ready() -> void:
	# Use hardcoded room list when in an exported project
	if OS.has_feature("editor"):  # Check if running in an exported project
		# Get all room paths when running in the editor
		var dir = DirAccess.open(room_dir)
		if dir:
			dir.list_dir_begin()
			var file_name = dir.get_next()
			while file_name != "":
				if not dir.current_is_dir() and file_name.get_extension() == "tscn":
					var full_path = room_dir.path_join(file_name)
					room_list.append(full_path)
				file_name = dir.get_next()
			dir.list_dir_end()
		else:
			printerr("An error occurred when trying to access room list.")
	else:
		room_list = [
			"res://scenes/rooms/intro_room.tscn",
			"res://scenes/rooms/room.tscn",
			"res://scenes/rooms/title_room.tscn",
			"res://scenes/rooms/load_failed_room.tscn",
			"res://scenes/rooms/endless_mode.tscn",
			"res://scenes/rooms/tutorial_room.tscn",
			"res://scenes/rooms/credits.tscn",
			"res://scenes/rooms/empty_room.tscn",
		]




	if room_list.is_empty():
		printerr("No rooms found. Check the directory or hardcoded paths.")
		return

	# Print out each room's directory for easy copy-paste
	for room in room_list:
		print('"', room, '"', ",")

	# Create buttons for each room
	for room_index in range(room_list.size()):
		var new_button = Button.new()
		new_button.text = room_list[room_index].get_file()
		new_button.connect("pressed", Callable(self, "_on_button_pressed").bind(room_index))
		button_container.add_child(new_button)

func _on_button_pressed(room_index: int) -> void:
	if room_index >= 0 and room_index < room_list.size():
		TransitionLayer.change_scene(room_list[room_index])
