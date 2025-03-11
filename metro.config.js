const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = withNativeWind(
  (() => {
    const config = getDefaultConfig(__dirname);

    config.resolver.assetExts = config.resolver.assetExts.filter(
      (ext) => ext !== "svg",
    );
    config.resolver.sourceExts.push("svg");
    config.transformer.babelTransformerPath = require.resolve(
      "react-native-svg-transformer",
    );

    return config;
  })(),
  { input: "./global.css" },
);
