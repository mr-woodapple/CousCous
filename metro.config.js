// Used to make firebase work with idb
module.exports = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    //added this
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
    },
  };