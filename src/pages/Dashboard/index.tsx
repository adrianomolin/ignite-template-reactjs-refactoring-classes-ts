import { Header } from '../../components/Header/index';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect, useState } from 'react';

interface foodProps {
  id: number,
  name: string,
  description: string,
  price: string, 
  available: boolean, 
  image: string
}

interface editingFoodProps {
  id: number,
  name: string,
  description: string,
  price: string, 
  available: boolean, 
  image: string
}

export function Dashboard() {
  const [foods, setFoods] = useState<foodProps[]>([]);
  const [editingFood, setEditingFood] = useState<editingFoodProps>({} as editingFoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('/foods').then((response) => {
      setFoods(response.data)
    })
    
  },[])

  async function handleAddFood(food: foodProps) {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods,response.data])
      // this.setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: foodProps) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      setFoods(foodsUpdated)
      // this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
    // this.setState({ foods: foodsFiltered });
  }

  function toggleModal() {

    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {

    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: editingFoodProps) {
    setEditingFood(food)
    setEditModalOpen(true)
  }
    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                products={food}
                handleDeleteProduct={handleDeleteFood}
                handleEditProduct={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }