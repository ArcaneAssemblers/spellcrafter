import { SpellcrafterPlugin } from './plugins/spellcrafter_plugin';

const BASE_URL = import.meta.env.BASE_URL;

const RenJSConfig =  {
  'name': 'Arcane Assembler',
  'w': 1080,
  'h': 1920,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'loadingScreen': {
    'loadingBar': {
      'asset': BASE_URL+'/ren_client/assets/gui/loadingbarspritesheet.png',
      'position': {
        'x': 240,
        'y': 1450
      },
      'size': {
        'w': 600,
        'h': 171
      }
    }
  },
  'fonts': BASE_URL+'/ren_client/assets/gui/fonts.css',
  'guiConfig': BASE_URL+'/story/GUI.yaml',
  storyConfig: BASE_URL+'/story/Config.yaml',
  storySetup: BASE_URL+'/story/Setup.yaml',
  'storyText': [
    BASE_URL+'/story/Story.yaml'
  ],
  'logChoices': false,
}

window.RenJSGame = new window.RenJS.game(RenJSConfig)
window.RenJSGame.addPlugin('SpellCrafter', SpellcrafterPlugin)
window.RenJSGame.launch()
