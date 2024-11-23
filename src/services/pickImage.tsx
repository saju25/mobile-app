

const pickImage = async () => {
    // Request permission to access media
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setShopPhoto(result.assets[0].uri); 
    }
  };

// Clear the selected image URI
  const removeImage = () => {
    setShopPhoto(null);  
  };