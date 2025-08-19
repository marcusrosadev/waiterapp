import { products } from "@/mocks/products";
import { FlatList, TouchableOpacity } from "react-native";
import { Text } from "../Text";
import { ProductImage, Product, ProductDetails, Separator, AddToCartButton } from "./styles";
import { formatCurrency } from "@/utils/formatCurrency";
import { PlusCircle } from "../Icons/PlusCircle";
import { ProductModal } from "../ProductModal";
import { useState } from "react";

export function Menu() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <FlatList
        data={products}
        style={{ marginTop: 32 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        keyExtractor={product => product._id}
        ItemSeparatorComponent={Separator}
        renderItem={({ item: product }) => (
          <Product onPress={() => setIsModalVisible(true)}>
            <ProductImage
              source={{
                uri: `http://192.168.18.22:3001/uploads/${product.imagePath}`
              }}
            />

            <ProductDetails>
              <Text weigth="600">{product.name}</Text>
              <Text
                size={14}
                color="#666"
                style={{ marginVertical: 8 }}
              >
                {product.description}
              </Text>
              <Text size={14} weight="600">{formatCurrency(product.price)}</Text>
            </ProductDetails>

            <AddToCartButton>
              <PlusCircle />
            </AddToCartButton>
          </Product>
        )}
      />
    </>
  )
}
