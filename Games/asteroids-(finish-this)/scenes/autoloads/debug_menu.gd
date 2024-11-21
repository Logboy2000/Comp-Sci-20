extends CanvasLayer

@onready var vbox: VBoxContainer = $Control/VBoxContainer

# A dictionary to store labels by their name for easy modification
var labels: Dictionary = {}

# Called when the node enters the scene tree for the first time
func _ready() -> void:
	# Optionally add some labels at the start
	add_label("Asteroids", ProjectSettings.get("application/config/name"))
	add_label("FPS")

# Called every frame
func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("debug_menu"):
		visible = !visible
	
	# Example debug update: Update FPS value every frame
	var fps = str(Engine.get_frames_per_second())
	modify_label("FPS", "FPS: " + fps)

# Function to add a label
func add_label(label_name: String, text: String = "fill this") -> void:
	var label = Label.new()
	label.name = label_name
	label.text = text
	vbox.add_child(label)
	labels[label_name] = label

# Function to modify an existing label
func modify_label(label_name: String, new_text: String) -> void:
	if visible:
		if labels.has(label_name):
			var label = labels[label_name]
			label.text = new_text
		else:
			print("Label with name '%s' not found!" % label_name)

# Function to remove a label by its name
func remove_label(label_name: String) -> void:
	if labels.has(label_name):
		var label = labels[label_name]
		vbox.remove_child(label)
		labels.erase(label_name)
	else:
		print("Label with name '%s' not found!" % label_name)
