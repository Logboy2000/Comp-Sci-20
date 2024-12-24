extends Node

var upgrades: Dictionary = {}

enum UpgradeType {
	INCREMENTAL,
	ONE_SHOT
}

func _ready() -> void:
	reset_all()



func add_upgrade(
	upgrade_key: String, 
	display_name: String, 
	starting_price: int, 
	price_multiplier: float,
	icon: Texture2D = preload("res://assets/sprites/upgrade_icons/placeholder.png"),
	buy_sound: AudioStream = preload("res://assets/Audio/buy.ogg"),
	type: UpgradeType = UpgradeType.INCREMENTAL,
	buy_function: Callable = func (): pass,
	restocks: bool = true,
) -> void:
	if not upgrades.has(upgrade_key):
		upgrades[upgrade_key] = {
			"display_name": display_name,
			"starting_price": starting_price,
			"price": starting_price,
			"level": 1,
			"price_multiplier": price_multiplier,
			"icon": icon,
			"buy_sound": buy_sound,
			"type": type,
			"buy_function": buy_function,
			"restocks": restocks,
		}
	else:
		print("Upgrade with this key already exists!")

# Helper functions to get and set properties for upgrades
func get_display_name(property: StringName) -> String:
	return upgrades.get(property)["display_name"]

func get_level(property: StringName) -> int:
	return upgrades.get(property)["level"]

func set_level(property: StringName, value: int) -> void:
	upgrades[property]["level"] = value

func get_price(property: StringName) -> int:
	return upgrades.get(property)["price"]

func set_price(property: StringName, value: int) -> void:
	upgrades[property]["price"] = value

func get_starting_price(property: StringName) -> int:
	return upgrades.get(property)["starting_price"]

func get_price_multiplier(property: StringName) -> float:
	return upgrades.get(property)["price_multiplier"]

func get_icon(property: StringName) -> Texture2D:
	return upgrades.get(property)["icon"]

func get_type(property: StringName) -> UpgradeType:
	return upgrades.get(property)["type"]

func get_does_restock(property: StringName) -> bool:
	return upgrades.get(property)["restocks"]

func get_buy_sound(property: StringName) -> AudioStream:
	return upgrades.get(property)["buy_sound"]

func get_random_upgrade_key() -> String:
	if upgrades.size() == 0:
		return ""
	
	# Exclude 'restock_shop' from the list of keys
	var keys = upgrades.keys().filter(func(key): return key != "restock_shop")
	
	if keys.size() == 0:
		return ""  # Return an empty string if no other upgrades exist
	
	# Select a random key from the filtered list
	return keys[randi() % keys.size()]


# Method to buy an upgrade
func buy(property: StringName, for_free: bool = false) -> void:
	if not for_free:
		GameManager.coins -= get_price(property)
	upgrades[property]["level"] += 1
	upgrades[property]["price"] = round(get_starting_price(property) * pow(get_price_multiplier(property), get_level(property)))
	upgrades[property]["buy_function"].call()

func cheat() -> void:
	for key in upgrades.keys():
		for i in range(10):
			buy(key, true)


func reset_all() -> void:
	upgrades.clear()  
	add_default_upgrades()  # Re-add default upgrades

func add_default_upgrades() -> void:
	add_upgrade(
		"restock_shop", 
		"Restock", 
		15, 
		1.25,
		
	)
	add_upgrade(
		"speed", 
		"Speed", 
		25,
		1.5,
		preload("res://assets/sprites/upgrade_icons/speed.png")
	)
	add_upgrade(
		"multishot", 
		"Multishot", 
		400, 
		1.8,
		preload("res://assets/sprites/upgrade_icons/multishot.png")
	)
	add_upgrade(
		"magnet_radius", 
		"Magnet Radius", 
		10,
		1.8,
		preload("res://assets/sprites/upgrade_icons/magnet.png")
	)
	add_upgrade(
		"heal", 
		"Heal", 
		50, 
		1.6,
		preload("res://assets/sprites/upgrade_icons/heal.png"),
		preload("res://assets/Audio/heal.ogg"),
		UpgradeType.ONE_SHOT,
		func():
			GameManager.player.heal(5)
	)
	add_upgrade(
		"max_health", 
		"Max Health", 
		200, 
		1.8,
		preload("res://assets/sprites/upgrade_icons/max_health.png"),
		preload("res://assets/Audio/heal.ogg"),
		UpgradeType.INCREMENTAL,
		func(): 
			GameManager.player.max_hp  = GameManager.player.starting_max_hp + (get_level("max_health") * 5) - 5
			GameManager.player.heal(5)
	)
	add_upgrade(
		"piercing", 
		"Piercing", 
		150, 
		2,
		preload("res://assets/sprites/upgrade_icons/piercing.png")
	)
	add_upgrade(
		"greed",
		"Greed",
		100,
		1.1,
		preload("res://assets/sprites/upgrade_icons/greed.png")
	)
