import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTodos } from './hooks/useTodos';


export default function App() {

  const {
    items,
    input,
    setInput,
    addItem,
    toggleDone,
    deleteItem,
    clearAllTasks,
    isLoading
  } = useTodos()

  // clearAllTask alert
  const handleClearAll = () => {
    if (items.length === 0) return        // Varmistus, vaikka nappi on onkin disabloitu

    Alert.alert(
      'Clear all tasks',
      'Are you sure you want to clear ALL the tasks??',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear all tasks',
          style: 'destructive',
          onPress: () => clearAllTasks()
        }
      ]
    )
  }

  // Näytetään teksti kun lataus kesken.
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Todo list</Text>
        <Text>Ladataan tehtäviä...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo list</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter task"
        />
        <Button title="Save" onPress={addItem} />
      </View>


      <View style={{ marginBottom: 18 }}>
        <Button
          title="Clear All Tasks"
          color="#888"
          onPress={handleClearAll}
          disabled={items.length === 0} // disbloi, jos ei tehtäviä
        />

      </View>

      <StatusBar style="auto" />

      <SwipeListView
        data={items}
        keyExtractor={item => item.id}

        // front row
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={1}        // 👈 estää delete-välkähdyksen
            onPress={() => toggleDone(item.id)}
          >
            <View style={styles.rowFront}>
              <Text
                style={[
                  styles.taskText,
                  item.done && styles.taskTextDone,
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        // swipe vasen -> delete
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <Button
              title="Delete"
              color="#d11a2a"
              onPress={() => deleteItem(item.id)}
            />
          </View>
        )}

        rightOpenValue={-100}
        disableRightSwipe
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 11,
    marginRight: 10,
  },
  rowFront: {
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    padding: 16,
    borderColor: '#eee'
  },
  rowBack: {
    backgroundColor: '#ddd',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#888'
  }

});
