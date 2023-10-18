import { SpellcrafterPlugin } from './plugins/spellcrafter_plugin';

const BASE_URL = import.meta.env.BASE_URL;

const RenJSConfig =  {
  'name': 'Quickstart',
  'w': 1080,
  'h': 1920,
  'renderer': Phaser.AUTO, // become renderer
  'scaleMode': Phaser.ScaleManager.SHOW_ALL,
  'loadingScreen': {
    'background': BASE_URL+'/assets/gui/loaderloaderbackground.png',
    'loadingBar': {
      'asset': BASE_URL+'/assets/gui/loaderloading-bar.png',
      'position': {
        'x': 109,
        'y': 458
      },
      'size': {
        'w': 578,
        'h': 82
      }
    }
  },
  'fonts': BASE_URL+'/assets/gui/fonts.css',
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
