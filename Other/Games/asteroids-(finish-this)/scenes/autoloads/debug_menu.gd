extends CanvasLayer
@onready var debug_info: VBoxContainer = $Control/MarginContainer/DebugInfo
@onready var animation_player: AnimationPlayer = $AnimationPlayer

# A dictionary to store labels by their name for easy modification
var labels: Dictionary = {}

# Called when the node enters the scene tree for the first time
func _ready() -> void:
	# Optionally add some labels at the start
	add_label("name", ProjectSettings.get("application/config/name")+ "v" + ProjectSettings.get("application/config/version"))


func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("toggle_debug"):
		GameManager.debug_mode = !GameManager.debug_mode
		if GameManager.debug_mode:
			animation_player.play("exit")
		else:
			animation_player.play("enter")
	
	
	var fps = str(Engine.get_frames_per_second())
	modify_label("fps", "FPS: " + fps)

# Function to add a label
func add_label(label_name: String, text: String = "fill this") -> void:
	var label = Label.new()
	label.name = label_name
	label.text = text
	debug_info.add_child(label)
	labels[label_name] = label

# Function to modify an existing label
func modify_label(label_name: String, new_text: String) -> void:
	if visible:
		if labels.has(label_name):
			var label = labels[label_name]
			label.text = new_text
		else:
			add_label(label_name)
			modify_label(label_name, new_text)

# Function to remove a label by its name
func remove_label(label_name: String) -> void:
	if labels.has(label_name):
		var label = labels[label_name]
		debug_info.remove_child(label)
		labels.erase(label_name)
	else:
		print("Label with name '%s' not found!" % label_name)
