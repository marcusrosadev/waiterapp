import { ActivityIndicator } from "react-native";

import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { Categories } from "@/components/Categories";
import { Button } from "@/components/Button";
import { TableModal } from "@/components/TableModal";
import { useEffect, useState } from "react";
import { Cart } from "@/components/Cart";

import { Container, CategoriesContainer, MenuContainer, Footer, FooterContainer, CenteredContainer } from "./styles";

import { CartItem } from "@/types/CartItem";
import { Product } from "@/types/product";

import { Empty } from "@/components/Icons/Empty";
import { Text } from "@/components/Text";
import { Category } from "@/types/categories";
import { api } from "@/utils/api";

export function Main() {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [selectedTable, setSelectedTable] = useState('');

  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products')
    ]).then(([ categoriesRes, productsRes ]) => {
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
      setIsLoading(false);
    });
  }, [])

  async function handleSelectCategory(categoryId: string) {
    const route = !categoryId
      ? '/products'
      : `/categories/${categoryId}/products`;

      setIsLoadingProducts(true);

    const { data } = await api.get(route);
    setProducts(data);
      setIsLoadingProducts(false);
  }

  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleResetOrder() {
    setSelectedTable('')
    setCartItems([])
  }

  function handleAddToCard(product: Product) {
    if(!selectedTable) {
      setIsTableModalVisible(true);
    }

    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      )

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product,
        })
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];
      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      }

      return newCartItems;
    })
  }

  function handleDecrementCartItems(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      )

      const item = prevState[itemIndex];

      const newCartItems = [...prevState];

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1)

        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      }

      return newCartItems;
    })
  }

  return (
   <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />

        {isLoading && (
          <CenteredContainer>
            <ActivityIndicator color="#D73035" size="large"/>
          </CenteredContainer>
        )}

        {!isLoading && (
          <>
            <CategoriesContainer>
              <Categories
                categories={categories}
                onSelectCategory={handleSelectCategory}
              />
            </CategoriesContainer>

            {isLoadingProducts ? (
              <CenteredContainer>
                <ActivityIndicator color="#D73035" size="large"/>
              </CenteredContainer>
            ) : (
              <>
                {products.length > 0 ? (
                  <MenuContainer>
                    <Menu
                      onAddToCart={handleAddToCard}
                      products={products}
                    />
                  </MenuContainer>
                ): (
                  <CenteredContainer>
                    <Empty />

                    <Text color="#666" style={{ marginTop: 24 }}>Nenhum produto foi encontrado!</Text>
                  </CenteredContainer>
                )}
              </>
            )}


          </>
        )}

      </Container>
      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button
              onPress={() => setIsTableModalVisible(true)}
              disabled={isLoading}
            >
              Novo Pedido
            </Button>
          )}

          {selectedTable && (
            <Cart
              cartItems={cartItems}
              onAdd={handleAddToCard}
              onDecrement={handleDecrementCartItems}
              onConfirmOrder={handleResetOrder}
              selectedTable={selectedTable}
            />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(false)}
        onSave={handleSaveTable}
      />
   </>
  )
}
