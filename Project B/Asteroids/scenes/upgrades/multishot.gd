extends Upgrade

func level_up(amount: int = 1):
	super.level_up(amount)
	GameManager.player.bullet_count = level
