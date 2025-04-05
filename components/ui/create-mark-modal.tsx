import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface MarkerCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: (data: {
    description: string;
    latitude: number;
    longitude: number;
    type: string;
  }) => void;
  coordinates: [number, number] | null;
}

const MarkerCreationModal: React.FC<MarkerCreationModalProps> = ({
  onClose,
  onCreated,
  coordinates,
}) => {
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'danger' | 'recommend' | 'warning'>(
    'danger',
  );

  const handleCreate = () => {
    if (!coordinates) return;
    onCreated({
      description,
      latitude: coordinates[1],
      longitude: coordinates[0],
      type,
    });
    setDescription('');
  };

  return (
    <View>
      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите описание"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Тип</Text>
      <View style={styles.typesRow}>
        {['danger', 'recommend', 'warning'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.typeButton, type === t && styles.typeButtonSelected]}
            onPress={() => setType(t as any)}>
            <Text>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Создать метку" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {fontSize: 16, marginTop: 8},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  typesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#e0e0e0',
  },
});

export default MarkerCreationModal;
